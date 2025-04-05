import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Topics from '../pages/Topics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: [
      {
        id: 1,
        name: 'RAG Systems',
        description: 'Learn about Retrieval Augmented Generation',
        difficulty_level: 3
      },
      {
        id: 2,
        name: 'Vector Databases',
        description: 'Understand vector databases',
        difficulty_level: 4
      }
    ]
  }))
}));

describe('Topics Component', () => {
  const renderTopics = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Topics />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders loading state initially', () => {
    renderTopics();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders topics after loading', async () => {
    renderTopics();
    await waitFor(() => {
      expect(screen.getByText('RAG Systems')).toBeInTheDocument();
      expect(screen.getByText('Vector Databases')).toBeInTheDocument();
    });
  });

  it('displays topic descriptions', async () => {
    renderTopics();
    await waitFor(() => {
      expect(screen.getByText('Learn about Retrieval Augmented Generation')).toBeInTheDocument();
      expect(screen.getByText('Understand vector databases')).toBeInTheDocument();
    });
  });

  it('displays difficulty levels', async () => {
    renderTopics();
    await waitFor(() => {
      expect(screen.getByText('Difficulty: 3')).toBeInTheDocument();
      expect(screen.getByText('Difficulty: 4')).toBeInTheDocument();
    });
  });

  it('renders learning paths section', () => {
    renderTopics();
    expect(screen.getByText('Learning Paths')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Mock axios to reject
    jest.spyOn(require('axios'), 'get').mockRejectedValueOnce(
      new Error('Failed to fetch topics')
    );

    renderTopics();
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('displays topics list', async () => {
    renderTopics();
    await waitFor(() => {
      expect(screen.getByText(/Topics/i)).toBeInTheDocument();
    });
  });

  it('shows topic details', async () => {
    renderTopics();
    await waitFor(() => {
      expect(screen.getByText(/Description/i)).toBeInTheDocument();
      expect(screen.getByText(/Difficulty/i)).toBeInTheDocument();
    });
  });

  it('navigates to quiz when clicking start quiz', async () => {
    renderTopics();
    await waitFor(() => {
      const startButton = screen.getByText(/Start Quiz/i);
      fireEvent.click(startButton);
      expect(window.location.pathname).toContain('/quiz/');
    });
  });
}); 