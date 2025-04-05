import pygame
import sys

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
BUTTON_WIDTH = 200
BUTTON_HEIGHT = 50

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (128, 128, 128)
LIGHT_GRAY = (200, 200, 200)

# Set up the display
screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("Who's That Builder?")

# Font
font = pygame.font.Font(None, 36)

def draw_button(text, x, y, width, height, active_color, inactive_color):
    mouse = pygame.mouse.get_pos()
    click = pygame.mouse.get_pressed()
    
    # Check if mouse is over the button
    if x < mouse[0] < x + width and y < mouse[1] < y + height:
        pygame.draw.rect(screen, active_color, (x, y, width, height))
        if click[0] == 1:
            return True
    else:
        pygame.draw.rect(screen, inactive_color, (x, y, width, height))
    
    # Draw button text
    text_surface = font.render(text, True, BLACK)
    text_rect = text_surface.get_rect()
    text_rect.center = (x + width/2, y + height/2)
    screen.blit(text_surface, text_rect)
    return False

def main():
    clock = pygame.time.Clock()
    running = True
    
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        
        # Fill background
        screen.fill(WHITE)
        
        # Draw title
        title = font.render("Who's That Builder?", True, BLACK)
        title_rect = title.get_rect(center=(WINDOW_WIDTH/2, WINDOW_HEIGHT/3))
        screen.blit(title, title_rect)
        
        # Draw play button
        button_x = WINDOW_WIDTH/2 - BUTTON_WIDTH/2
        button_y = WINDOW_HEIGHT - 100
        if draw_button("Play", button_x, button_y, BUTTON_WIDTH, BUTTON_HEIGHT, LIGHT_GRAY, GRAY):
            print("Play button clicked!")  # We'll add game logic here later
        
        pygame.display.flip()
        clock.tick(60)
    
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main() 