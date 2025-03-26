import re
import tkinter as tk
from tkinter import messagebox

def validate_email(email):
    """
    Validates an email address using a regular expression.

    Args:
        email (str): The email address to validate.

    Returns:
        bool: True if the email is valid, False otherwise.
    """
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None

def check_email():
    email = email_entry.get()
    if validate_email(email):
        messagebox.showinfo("Validation Result", f"{email} is a valid email.")
    else:
        messagebox.showerror("Validation Result", f"{email} is not a valid email.")

# Create the GUI
if __name__ == "__main__":
    root = tk.Tk()
    root.title("Email Validator")

    tk.Label(root, text="Enter Email:").pack(pady=5)
    email_entry = tk.Entry(root, width=40)
    email_entry.pack(pady=5)

    validate_button = tk.Button(root, text="Validate", command=check_email)
    validate_button.pack(pady=10)

    root.mainloop()