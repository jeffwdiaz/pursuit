import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Quiz from '../pages/Quiz';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ topicId: '1' }),
}));

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: [
      {
        id: 1,
        question_text: 'What is RAG?',
        options: ['A', 'B', 'C', 'D'],
        correct_answer: 'A',
        explanation: 'RAG stands for Retrieval Augmented Generation'
      }
    ]
  })),
  post: jest.fn(() => Promise.resolve({
    data: {
      is_correct: true,
      explanation: 'Your answer is correct!'
    }
  }))
}));

describe('Quiz Component', () => {
  const renderQuiz = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Quiz />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders loading state initially', () => {
    renderQuiz();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('displays quiz questions', async () => {
    renderQuiz();
    await waitFor(() => {
      expect(screen.getByText(/Question/i)).toBeInTheDocument();
    });
  });

  it('allows selecting answers', async () => {
    renderQuiz();
    await waitFor(() => {
      const answerButton = screen.getByText(/Answer/i);
      fireEvent.click(answerButton);
      expect(answerButton).toHaveClass('selected');
    });
  });

  it('shows explanation after submitting answer', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Quiz />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('What is RAG?')).toBeInTheDocument();
    });

    const answerButton = screen.getByText('A');
    fireEvent.click(answerButton);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Your answer is correct!')).toBeInTheDocument();
    });
  });
}); 