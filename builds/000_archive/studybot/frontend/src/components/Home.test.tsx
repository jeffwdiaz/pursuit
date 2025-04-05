import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Home from '../pages/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const queryClient = new QueryClient();

describe('Home Component', () => {
  const renderHome = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders welcome message', () => {
    renderHome();
    expect(screen.getByText(/Welcome to LLM Learning Bot/i)).toBeInTheDocument();
  });

  it('renders featured topics', () => {
    renderHome();
    expect(screen.getByText(/RAG Systems/i)).toBeInTheDocument();
    expect(screen.getByText(/Vector Databases/i)).toBeInTheDocument();
    expect(screen.getByText(/LLM Validation/i)).toBeInTheDocument();
  });

  it('renders topic descriptions', () => {
    renderHome();
    expect(screen.getByText(/Learn about Retrieval Augmented Generation/i)).toBeInTheDocument();
    expect(screen.getByText(/Understanding vector databases and embeddings/i)).toBeInTheDocument();
  });

  it('renders difficulty levels', () => {
    renderHome();
    expect(screen.getByText(/Difficulty: Advanced/i)).toBeInTheDocument();
    expect(screen.getByText(/Difficulty: Intermediate/i)).toBeInTheDocument();
  });

  it('navigates to quiz when clicking start quiz', () => {
    renderHome();
    const topicButton = screen.getByText('Start Quiz').closest('button');
    if (topicButton) {
      fireEvent.click(topicButton);
      expect(mockNavigate).toHaveBeenCalledWith('/quiz/1');
    }
  });

  it('shows login prompt for non-authenticated users', () => {
    renderHome();
    expect(screen.getByText(/Sign in to track your progress/i)).toBeInTheDocument();
  });

  it('renders benefits section', () => {
    renderHome();

    expect(screen.getByText('Why Learn with LLM Learning Bot?')).toBeInTheDocument();
    expect(screen.getByText('Interactive Learning')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive Coverage')).toBeInTheDocument();
    expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
    expect(screen.getByText('Expert Guidance')).toBeInTheDocument();
  });

  it('shows different content for logged-in users', async () => {
    // Mock the auth context to simulate logged in state
    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      user: {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        is_active: true
      }
    }));

    renderHome();

    expect(screen.getByText(/Welcome back, Test User/i)).toBeInTheDocument();
    expect(screen.getByText('Continue Learning')).toBeInTheDocument();
  });
}); 