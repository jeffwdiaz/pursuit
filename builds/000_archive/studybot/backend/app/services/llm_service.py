from typing import Dict, List
import openai
from ..core.config import settings

# Initialize OpenAI client
openai.api_key = settings.OPENAI_API_KEY

async def generate_question(topic: str, difficulty_level: int) -> Dict:
    """
    Generate a question using OpenAI's GPT model.
    """
    prompt = f"""Generate a multiple-choice question about {topic} at difficulty level {difficulty_level}/5.
    The question should be challenging but fair, and the options should be plausible.
    Format the response as a JSON object with the following structure:
    {{
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "The correct option letter (A, B, C, or D)",
        "explanation": "A detailed explanation of why the correct answer is right",
        "difficulty_level": {difficulty_level}
    }}
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert quiz generator specializing in LLM and AI topics."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        # Parse the response and return the question data
        question_data = eval(response.choices[0].message.content)
        return question_data
    
    except Exception as e:
        raise Exception(f"Error generating question: {str(e)}")

async def validate_answer(question: str, correct_answer: str, user_answer: str) -> bool:
    """
    Validate a user's answer using OpenAI's GPT model.
    """
    prompt = f"""Given the following question and answers, determine if the user's answer is correct.
    Question: {question}
    Correct Answer: {correct_answer}
    User's Answer: {user_answer}
    
    Respond with only 'true' or 'false' based on whether the user's answer is correct.
    Consider partial correctness and alternative valid answers.
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert answer validator for LLM and AI topics."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=10
        )
        
        # Parse the response and return the boolean result
        result = response.choices[0].message.content.strip().lower()
        return result == "true"
    
    except Exception as e:
        raise Exception(f"Error validating answer: {str(e)}")

async def generate_explanation(question: str, answer: str) -> str:
    """
    Generate a detailed explanation for a question and answer.
    """
    prompt = f"""Generate a detailed explanation for the following question and answer:
    Question: {question}
    Answer: {answer}
    
    The explanation should:
    1. Explain why the answer is correct
    2. Provide additional context and related concepts
    3. Include any relevant best practices or common pitfalls
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert teacher explaining LLM and AI concepts."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        raise Exception(f"Error generating explanation: {str(e)}") 