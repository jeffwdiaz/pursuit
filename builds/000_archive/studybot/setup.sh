#!/bin/bash

# Exit on error
set -e

echo "Setting up LLM Learning Bot..."

# Create and activate virtual environment for backend
echo "Setting up Python virtual environment..."
cd backend
python -m venv venv
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Return to root directory
cd ..

# Initialize database
echo "Initializing database..."
npm run init-db

echo "Setup complete! You can now run the application with:"
echo "npm run dev" 