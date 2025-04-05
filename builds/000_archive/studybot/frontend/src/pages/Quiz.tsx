import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty_level: number;
}

interface QuizResult {
  total_questions: number;
  correct_answers: number;
  average_response_time: number;
  topic_id: number;
  completed_at: string;
}

const Quiz: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Fetch questions for the topic
  const { data: questions, isLoading: isLoadingQuestions } = useQuery<Question[]>({
    queryKey: ['questions', topicId],
    queryFn: async () => {
      const response = await axios.post(`http://localhost:8000/api/quiz/session`, {
        topic_id: parseInt(topicId || '0'),
        number_of_questions: 10
      });
      return response.data;
    },
    enabled: !!topicId
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: { question_id: number; selected_answer: string; response_time: number }) => {
      const response = await axios.post('http://localhost:8000/api/quiz/answer', answer);
      return response.data;
    },
    onSuccess: () => {
      setShowExplanation(true);
    }
  });

  // Get quiz results
  const { data: quizResult, isLoading: isLoadingResults } = useQuery<QuizResult>({
    queryKey: ['quizResult', topicId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:8000/api/quiz/results/${topicId}`);
      return response.data;
    },
    enabled: !!topicId && showExplanation
  });

  useEffect(() => {
    if (questions && currentQuestionIndex < questions.length) {
      setStartTime(Date.now());
      setShowExplanation(false);
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelect = async (answer: string) => {
    if (!questions || !startTime) return;

    const responseTime = Math.floor((Date.now() - startTime) / 1000);
    setSelectedAnswer(answer);

    await submitAnswerMutation.mutateAsync({
      question_id: questions[currentQuestionIndex].id,
      selected_answer: answer,
      response_time: responseTime
    });
  };

  const handleNextQuestion = () => {
    if (!questions) return;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      navigate('/topics');
    }
  };

  if (isLoadingQuestions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">No questions available</h2>
        <p className="mt-2 text-gray-600">Please try another topic.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              Difficulty: {currentQuestion.difficulty_level}/5
            </span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question_text}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
              className={`w-full p-4 text-left rounded-lg border ${
                selectedAnswer === option
                  ? option === currentQuestion.correct_answer
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Explanation</h3>
            <p className="text-gray-600">{currentQuestion.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}

        {isLoadingResults && (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {quizResult && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium text-green-900 mb-2">Quiz Results</h3>
            <p className="text-green-700">
              You scored {quizResult.correct_answers} out of {quizResult.total_questions} questions correctly!
            </p>
            <p className="text-green-700">
              Average response time: {quizResult.average_response_time.toFixed(1)} seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz; 