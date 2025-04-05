# LLM Learning Bot

An educational application focused on LLM topics, particularly RAG systems, vector databases, validation, LLM fine-tuning, and orchestration. The application features automated learning with quizzes on preselected topics.

## Features

- User authentication (registration and login)
- Topic-based quizzes
- Real-time feedback and explanations
- Progress tracking
- Quiz history
- User profile management
- Responsive design with Tailwind CSS

## Tech Stack

### Backend
- Python 3.8+
- FastAPI
- SQLAlchemy
- PostgreSQL
- OpenAI API for question generation and validation

### Frontend
- React
- TypeScript
- React Router
- React Query
- Tailwind CSS
- Axios

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- PostgreSQL
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/llm-learning-bot.git
cd llm-learning-bot
```

2. Create and activate a virtual environment for the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
# Install all dependencies (both frontend and backend)
npm run install-all
```

4. Set up environment variables:
```bash
# Copy the example environment file
cp backend/.env.example backend/.env

# Edit backend/.env with your configuration
# Make sure to set your OpenAI API key and database connection string
```

5. Initialize the database:
```bash
npm run init-db
```

## Running the Application

1. Start both frontend and backend servers:
```bash
npm run dev
```

This will start:
- Backend server at http://localhost:8000
- Frontend development server at http://localhost:3000

2. Access the application in your browser at http://localhost:3000

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
llm-learning-bot/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── scripts/
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 