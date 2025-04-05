@echo off
echo Setting up LLM Learning Bot...

:: Create and activate virtual environment for backend
echo Setting up Python virtual environment...
cd backend
python -m venv venv
call venv\Scripts\activate

:: Install backend dependencies
echo Installing backend dependencies...
pip install -r requirements.txt

:: Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
call npm install

:: Return to root directory
cd ..

:: Initialize database
echo Initializing database...
call npm run init-db

echo Setup complete! You can now run the application with:
echo npm run dev 