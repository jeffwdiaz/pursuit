import pytest
from unittest.mock import patch, MagicMock
from app.services.llm_service import LLMService

@pytest.fixture
def llm_service():
    return LLMService()

def test_generate_question(llm_service):
    with patch('openai.ChatCompletion.create') as mock_create:
        # Mock the OpenAI API response
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(
                message=MagicMock(
                    content='{"question": "What is RAG?", "options": ["A", "B", "C", "D"], "correct_answer": "A", "explanation": "RAG stands for Retrieval Augmented Generation"}'
                )
            )
        ]
        mock_create.return_value = mock_response

        # Test question generation
        result = llm_service.generate_question("RAG Systems", 1)
        
        assert "question" in result
        assert "options" in result
        assert "correct_answer" in result
        assert "explanation" in result
        assert result["question"] == "What is RAG?"
        assert result["correct_answer"] == "A"

def test_validate_answer(llm_service):
    with patch('openai.ChatCompletion.create') as mock_create:
        # Mock the OpenAI API response
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(
                message=MagicMock(
                    content='{"is_correct": true, "explanation": "Your answer is correct because..."}'
                )
            )
        ]
        mock_create.return_value = mock_response

        # Test answer validation
        result = llm_service.validate_answer(
            "What is RAG?",
            "RAG stands for Retrieval Augmented Generation",
            "RAG stands for Retrieval Augmented Generation"
        )
        
        assert "is_correct" in result
        assert "explanation" in result
        assert result["is_correct"] is True

def test_generate_question_error_handling(llm_service):
    with patch('openai.ChatCompletion.create') as mock_create:
        # Mock API error
        mock_create.side_effect = Exception("API Error")

        # Test error handling
        with pytest.raises(Exception) as exc_info:
            llm_service.generate_question("RAG Systems", 1)
        
        assert str(exc_info.value) == "API Error"

def test_validate_answer_error_handling(llm_service):
    with patch('openai.ChatCompletion.create') as mock_create:
        # Mock API error
        mock_create.side_effect = Exception("API Error")

        # Test error handling
        with pytest.raises(Exception) as exc_info:
            llm_service.validate_answer(
                "What is RAG?",
                "RAG stands for Retrieval Augmented Generation",
                "RAG stands for Retrieval Augmented Generation"
            )
        
        assert str(exc_info.value) == "API Error"

def test_generate_question_invalid_response(llm_service):
    with patch('openai.ChatCompletion.create') as mock_create:
        # Mock invalid JSON response
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(
                message=MagicMock(
                    content='Invalid JSON'
                )
            )
        ]
        mock_create.return_value = mock_response

        # Test invalid response handling
        with pytest.raises(ValueError) as exc_info:
            llm_service.generate_question("RAG Systems", 1)
        
        assert "Invalid response format" in str(exc_info.value)

def test_validate_answer_invalid_response(llm_service):
    with patch('openai.ChatCompletion.create') as mock_create:
        # Mock invalid JSON response
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(
                message=MagicMock(
                    content='Invalid JSON'
                )
            )
        ]
        mock_create.return_value = mock_response

        # Test invalid response handling
        with pytest.raises(ValueError) as exc_info:
            llm_service.validate_answer(
                "What is RAG?",
                "RAG stands for Retrieval Augmented Generation",
                "RAG stands for Retrieval Augmented Generation"
            )
        
        assert "Invalid response format" in str(exc_info.value) 