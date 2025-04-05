from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime

# Topic schemas
class TopicBase(BaseModel):
    name: str
    description: str
    difficulty_level: int

class TopicCreate(TopicBase):
    pass

class Topic(TopicBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Question schemas
class QuestionBase(BaseModel):
    question_text: str
    options: List[str]
    correct_answer: str
    explanation: str
    difficulty_level: int

class QuestionCreate(QuestionBase):
    topic_id: int

class Question(QuestionBase):
    id: int
    topic_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# User Response schemas
class UserResponseBase(BaseModel):
    selected_answer: str
    response_time: int

class UserResponseCreate(UserResponseBase):
    question_id: int

class UserResponse(UserResponseBase):
    id: int
    user_id: int
    question_id: int
    is_correct: bool
    created_at: datetime

    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Quiz session schemas
class QuizSession(BaseModel):
    topic_id: int
    difficulty_level: Optional[int] = None
    number_of_questions: int = 10

class QuizResult(BaseModel):
    total_questions: int
    correct_answers: int
    average_response_time: float
    topic_id: int
    completed_at: datetime

    class Config:
        from_attributes = True 