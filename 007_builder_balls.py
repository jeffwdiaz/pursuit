import tkinter as tk
from tkinter import ttk
import random
import math

class PursuitAnimation:
    def __init__(self, root):
        self.root = root
        self.root.title("Pursuit Build 007")
        
        # Configure high DPI settings
        self.root.tk.call('tk', 'scaling', 2.0)
        
        # Set window size and color
        self.root.geometry("800x600")
        self.root.configure(bg='#423537')
        
        # Configure the grid weight
        self.root.grid_rowconfigure(0, weight=1)
        self.root.grid_columnconfigure(0, weight=1)
        
        # Create main frame with padding and matching background
        self.main_frame = ttk.Frame(self.root, style='Main.TFrame')
        self.main_frame.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)
        
        # Configure style for frame and label
        style = ttk.Style()
        style.configure('Main.TFrame', background='#423537')
        style.configure('Title.TLabel', background='#423537', foreground='#EDC893')
        
        # Load and configure the 'clam' theme for better button styling
        self.root.tk.call("ttk::style", "theme", "use", "clam")
        style.configure('Custom.TButton',
            background='#625357',
            foreground='white',
            borderwidth=0,
            focuscolor='#625357',
            padding=6
        )
        style.map('Custom.TButton',
            background=[('pressed', '!disabled', '#524347'), ('active', '#726367'), ('!active', '#625357')],
            foreground=[('pressed', 'white'), ('active', 'white'), ('!active', 'white')],
            relief=[('pressed', 'flat'), ('!pressed', 'flat')],
            borderwidth=[('active', 0), ('!active', 0)]
        )
        
        # Configure main frame grid weights
        self.main_frame.grid_rowconfigure(1, weight=1)
        self.main_frame.grid_columnconfigure(0, weight=1)
        
        # Create title label with crisp font and matching background
        self.title_label = tk.Label(
            self.main_frame, 
            text="Pursuit Build 007", 
            font=("Segoe UI", 16, "bold"),
            bg='#423537',
            fg='#EDC893'  # Explicitly set text color
        )
        self.title_label.grid(row=0, column=0, pady=10)
        
        # Create canvas with specified background
        self.canvas = tk.Canvas(
            self.main_frame,
            bg='#423537',  # Darkened background color
            width=780,
            height=450,
            highlightthickness=0
        )
        self.canvas.grid(row=1, column=0, sticky="nsew")
        
        # Create reset button with custom style
        self.reset_button = ttk.Button(
            self.main_frame,
            text="Reset",
            command=self.reset_animation,
            style='Custom.TButton'
        )
        self.reset_button.grid(row=2, column=0, pady=10)
        
        # Initialize circle storage
        self.circles = []
        
        # Constants
        self.CANVAS_WIDTH = 780
        self.CANVAS_HEIGHT = 450
        self.CIRCLE_RADIUS = 10
        self.SPEED = 4.0
        self.GRAVITY = 0.5
        
        # Create initial circles
        self.create_circles()
        
        # Start animation
        self.animate()
        
        # Start removal timer
        self.start_removal_timer()
    
    def create_circles(self):
        # Clear existing circles
        self.canvas.delete("all")
        self.circles = []
        self.active_count = 100  # Reset to exactly 100 balls
        
        # Update title with color
        self.title_label.configure(
            text=f"Pursuit Build 007 - {self.active_count} circles remaining",
            fg='#EDC893'  # Ensure text color is maintained
        )
        
        # Create exactly 100 circles
        for i in range(100):
            # Random position
            x = random.randint(20, self.CANVAS_WIDTH - 20)
            y = random.randint(20, self.CANVAS_HEIGHT - 20)
            
            # Random direction
            angle = random.uniform(0, 2 * math.pi)
            dx = math.cos(angle) * self.SPEED
            dy = math.sin(angle) * self.SPEED
            
            # First circle unique color, rest standard color
            color = '#BF675A' if i == 0 else '#EDC893'  # Updated ball colors
            
            # Draw circle and store its data
            circle_id = self.canvas.create_oval(
                x - self.CIRCLE_RADIUS,
                y - self.CIRCLE_RADIUS,
                x + self.CIRCLE_RADIUS,
                y + self.CIRCLE_RADIUS,
                fill=color,
                outline=color
            )
            
            # Store circle data
            circle = type('Circle', (), {
                'canvas_id': circle_id,
                'x': x,
                'y': y,
                'dx': dx,
                'dy': dy,
                'radius': self.CIRCLE_RADIUS,
                'active': True,
                'falling': False
            })
            
            self.circles.append(circle)
    
    def normalize_velocity(self, circle):
        # Calculate current speed
        speed = math.sqrt(circle.dx * circle.dx + circle.dy * circle.dy)
        if speed > 0:  # Prevent division by zero
            # Normalize to constant speed
            circle.dx = (circle.dx / speed) * self.SPEED
            circle.dy = (circle.dy / speed) * self.SPEED
            
            # Debug: Print speed if it deviates significantly from self.SPEED
            actual_speed = math.sqrt(circle.dx * circle.dx + circle.dy * circle.dy)
            if abs(actual_speed - self.SPEED) > 0.1:
                print(f"Warning: Circle {self.canvas.itemcget(circle.canvas_id, 'fill')} speed: {actual_speed:.2f} vs expected {self.SPEED}")
    
    def check_collision(self, circle1, circle2):
        # Only skip collision check if either circle is not active
        if not circle1.active or not circle2.active:
            return False
            
        dx = circle1.x - circle2.x
        dy = circle1.y - circle2.y
        distance = math.sqrt(dx * dx + dy * dy)
        
        if distance < circle1.radius + circle2.radius and distance > 0:
            # Calculate collision response
            # Normal vector
            nx = dx / distance
            ny = dy / distance
            
            # Relative velocity
            vx = circle1.dx - circle2.dx
            vy = circle1.dy - circle2.dy
            
            # Relative velocity along normal
            vn = vx * nx + vy * ny
            
            # If circles are moving apart, don't collide
            if vn > 0:
                return False
                
            # Collision response
            restitution = 1.0  # Perfect elasticity to maintain energy
            j = -(1 + restitution) * vn
            
            # Apply impulse only if circles aren't falling
            if not circle1.falling:
                circle1.dx += j * nx
                circle1.dy += j * ny
                self.normalize_velocity(circle1)
                
            if not circle2.falling:
                circle2.dx -= j * nx
                circle2.dy -= j * ny
                self.normalize_velocity(circle2)
            
            # Move circles apart to prevent sticking
            overlap = (circle1.radius + circle2.radius - distance) / 2
            if overlap > 0:  # Only separate if actually overlapping
                circle1.x += overlap * nx
                circle1.y += overlap * ny
                circle2.x -= overlap * nx
                circle2.y -= overlap * ny
            
            return True
        return False
    
    def animate(self):
        # Move each circle
        for circle in self.circles:
            if not circle.active:
                continue
                
            if circle.falling:
                # Apply gravity
                circle.dy += self.GRAVITY
                
                # Update position with dampened horizontal movement
                circle.x += circle.dx * 0.99  # Slight air resistance
                circle.y += circle.dy
                
                # Check if reached bottom
                if circle.y + circle.radius >= self.CANVAS_HEIGHT:
                    circle.y = self.CANVAS_HEIGHT - circle.radius
                    circle.dy *= -0.5  # Bounce with energy loss
                    circle.dx *= 0.8   # Friction with floor
                    
                    # Stop if moving very slowly
                    if abs(circle.dy) < 0.1 and abs(circle.dx) < 0.1:
                        circle.active = False
                        self.active_count -= 1
            else:
                # Normal bouncing behavior
                circle.x += circle.dx
                circle.y += circle.dy
                
                # Bounce off walls with perfect reflection
                if circle.x - circle.radius <= 0:
                    circle.x = circle.radius
                    circle.dx = abs(circle.dx)  # Ensure positive x velocity
                    self.normalize_velocity(circle)  # Normalize after wall bounce
                elif circle.x + circle.radius >= self.CANVAS_WIDTH:
                    circle.x = self.CANVAS_WIDTH - circle.radius
                    circle.dx = -abs(circle.dx)  # Ensure negative x velocity
                    self.normalize_velocity(circle)  # Normalize after wall bounce
                    
                if circle.y - circle.radius <= 0:
                    circle.y = circle.radius
                    circle.dy = abs(circle.dy)  # Ensure positive y velocity
                    self.normalize_velocity(circle)  # Normalize after wall bounce
                elif circle.y + circle.radius >= self.CANVAS_HEIGHT:
                    circle.y = self.CANVAS_HEIGHT - circle.radius
                    circle.dy = -abs(circle.dy)  # Ensure negative y velocity
                    self.normalize_velocity(circle)  # Normalize after wall bounce
        
        # Check for collisions
        for i in range(len(self.circles)):
            for j in range(i + 1, len(self.circles)):
                self.check_collision(self.circles[i], self.circles[j])
        
        # Update circle positions on canvas
        for circle in self.circles:
            self.canvas.coords(
                circle.canvas_id,
                circle.x - circle.radius,
                circle.y - circle.radius,
                circle.x + circle.radius,
                circle.y + circle.radius
            )
        
        # Update title with remaining count
        self.title_label.configure(
            text=f"Pursuit Build 007 - {self.active_count} circles remaining",
            fg='#EDC893'
        )
        
        # Schedule next animation frame
        self.root.after(16, self.animate)  # ~60 FPS
    
    def remove_random_circle(self):
        if self.active_count > 40:  # Keep removing until 40 circles remain
            # Choose a random active circle
            active_circles = [c for c in self.circles if c.active and not c.falling]
            if active_circles:
                circle_to_fall = random.choice(active_circles)
                circle_to_fall.falling = True
                
                # Update title with color
                self.title_label.configure(
                    text=f"Pursuit Build 007 - {self.active_count} circles remaining",
                    fg='#EDC893'  # Ensure text color is maintained
                )
                
                # Schedule next removal
                self.root.after(1000, self.remove_random_circle)
    
    def start_removal_timer(self):
        self.title_label.configure(
            text=f"Pursuit Build 007 - {self.active_count} circles remaining",
            fg='#EDC893'  # Ensure text color is maintained
        )
        self.root.after(1000, self.remove_random_circle)
    
    def reset_animation(self):
        # Reset circle count
        self.active_count = 100
        
        # Update title with color
        self.title_label.configure(
            text=f"Pursuit Build 007 - {self.active_count} circles remaining",
            fg='#EDC893'  # Ensure text color is maintained
        )
        
        # Recreate all circles
        self.create_circles()
        
        # Restart removal timer
        self.root.after(1000, self.remove_random_circle)

def main():
    root = tk.Tk()
    app = PursuitAnimation(root)
    root.mainloop()

if __name__ == "__main__":
    main()