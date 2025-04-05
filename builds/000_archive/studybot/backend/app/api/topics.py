from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..core.database import get_db
from ..models.quiz import Topic
from ..schemas.quiz import TopicCreate, Topic as TopicSchema
from ..core.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[TopicSchema])
async def get_topics(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[Topic]:
    """Get all available topics."""
    return db.query(Topic).offset(skip).limit(limit).all()

@router.get("/{topic_id}", response_model=TopicSchema)
async def get_topic(
    topic_id: int,
    db: Session = Depends(get_db)
) -> Topic:
    """Get a specific topic by ID."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

@router.post("/", response_model=TopicSchema)
async def create_topic(
    topic: TopicCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Topic:
    """Create a new topic."""
    # Check if topic already exists
    db_topic = db.query(Topic).filter(Topic.name == topic.name).first()
    if db_topic:
        raise HTTPException(
            status_code=400,
            detail="Topic with this name already exists"
        )
    
    # Create new topic
    db_topic = Topic(
        name=topic.name,
        description=topic.description,
        difficulty_level=topic.difficulty_level
    )
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

@router.put("/{topic_id}", response_model=TopicSchema)
async def update_topic(
    topic_id: int,
    topic_update: TopicCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Topic:
    """Update a topic."""
    # Get existing topic
    db_topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    # Check if new name is already taken
    if topic_update.name != db_topic.name:
        existing_topic = db.query(Topic).filter(Topic.name == topic_update.name).first()
        if existing_topic:
            raise HTTPException(
                status_code=400,
                detail="Topic with this name already exists"
            )
    
    # Update topic
    db_topic.name = topic_update.name
    db_topic.description = topic_update.description
    db_topic.difficulty_level = topic_update.difficulty_level
    db_topic.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_topic)
    return db_topic

@router.delete("/{topic_id}")
async def delete_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> dict:
    """Delete a topic."""
    # Get existing topic
    db_topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    # Delete topic
    db.delete(db_topic)
    db.commit()
    
    return {"message": "Topic deleted successfully"} 