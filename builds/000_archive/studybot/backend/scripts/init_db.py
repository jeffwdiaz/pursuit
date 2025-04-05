import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine
from app.models.quiz import Base, Topic
from app.core.config import settings

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a new session
    db = SessionLocal()
    
    # Sample topics
    topics = [
        {
            "name": "RAG Systems",
            "description": "Learn about Retrieval Augmented Generation and how it enhances LLM capabilities by combining retrieval of relevant information with language generation.",
            "difficulty_level": 3
        },
        {
            "name": "Vector Databases",
            "description": "Understand vector databases and their role in modern AI applications, including similarity search and semantic retrieval.",
            "difficulty_level": 4
        },
        {
            "name": "LLM Validation",
            "description": "Master techniques for validating and evaluating LLM performance, including metrics, testing strategies, and quality assurance.",
            "difficulty_level": 3
        },
        {
            "name": "LLM Fine-tuning",
            "description": "Learn how to fine-tune LLMs for specific tasks and domains, including data preparation, training strategies, and optimization techniques.",
            "difficulty_level": 5
        },
        {
            "name": "LLM Orchestration",
            "description": "Explore methods for orchestrating multiple LLMs in complex applications, including chaining, routing, and managing multiple models.",
            "difficulty_level": 4
        }
    ]
    
    # Add topics to database
    for topic_data in topics:
        topic = Topic(**topic_data)
        db.add(topic)
    
    try:
        db.commit()
        print("Successfully initialized database with sample topics")
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 