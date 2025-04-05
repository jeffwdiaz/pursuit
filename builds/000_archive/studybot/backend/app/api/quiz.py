from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import random

from ..core.database import get_db
from ..models import quiz as models
from ..schemas import quiz as schemas
from ..services.llm_service import generate_question, validate_answer
from ..core.auth import get_current_user

router = APIRouter()

@router.post("/session", response_model=List[schemas.Question])
async def start_quiz_session(
    session: schemas.QuizSession,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Start a new quiz session with dynamically generated questions."""
    # Get topic
    topic = db.query(models.Topic).filter(models.Topic.id == session.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    # Generate questions using LLM
    questions = []
    for _ in range(session.number_of_questions):
        question_data = await generate_question(
            topic=topic.name,
            difficulty_level=session.difficulty_level or topic.difficulty_level
        )
        
        # Create question in database
        question = models.Question(
            topic_id=topic.id,
            question_text=question_data["question"],
            options=question_data["options"],
            correct_answer=question_data["correct_answer"],
            explanation=question_data["explanation"],
            difficulty_level=question_data["difficulty_level"]
        )
        db.add(question)
        questions.append(question)
    
    db.commit()
    return questions

@router.post("/answer", response_model=schemas.UserResponse)
async def submit_answer(
    response: schemas.UserResponseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Submit an answer to a question and get immediate feedback."""
    # Get question
    question = db.query(models.Question).filter(models.Question.id == response.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Validate answer using LLM
    is_correct = await validate_answer(
        question=question.question_text,
        correct_answer=question.correct_answer,
        user_answer=response.selected_answer
    )
    
    # Create user response
    user_response = models.UserResponse(
        user_id=current_user.id,
        question_id=question.id,
        selected_answer=response.selected_answer,
        is_correct=is_correct,
        response_time=response.response_time
    )
    
    db.add(user_response)
    db.commit()
    db.refresh(user_response)
    
    return user_response

@router.get("/results/{topic_id}", response_model=schemas.QuizResult)
async def get_quiz_results(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get quiz results for a specific topic."""
    # Get all responses for the topic
    responses = db.query(models.UserResponse).join(
        models.Question
    ).filter(
        models.Question.topic_id == topic_id,
        models.UserResponse.user_id == current_user.id
    ).all()
    
    if not responses:
        raise HTTPException(status_code=404, detail="No quiz results found for this topic")
    
    # Calculate statistics
    total_questions = len(responses)
    correct_answers = sum(1 for r in responses if r.is_correct)
    avg_response_time = sum(r.response_time for r in responses) / total_questions
    
    return schemas.QuizResult(
        total_questions=total_questions,
        correct_answers=correct_answers,
        average_response_time=avg_response_time,
        topic_id=topic_id,
        completed_at=datetime.utcnow()
    )

@router.get("/topics", response_model=List[schemas.Topic])
async def get_topics(
    db: Session = Depends(get_db)
):
    """Get all available quiz topics."""
    return db.query(models.Topic).all()

@router.get("/questions/{topic_id}", response_model=List[schemas.Question])
async def get_questions_by_topic(
    topic_id: int,
    limit: Optional[int] = 10,
    db: Session = Depends(get_db)
):
    """Get questions for a specific topic."""
    questions = db.query(models.Question).filter(
        models.Question.topic_id == topic_id
    ).limit(limit).all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this topic")
    
    return questions 