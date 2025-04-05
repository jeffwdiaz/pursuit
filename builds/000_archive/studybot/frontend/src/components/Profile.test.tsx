import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Profile from '../pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn((url) => {
    if (url === 'http://localhost:8000/api/users/me') {
      return Promise.resolve({
        data: {
          id: 1,
          email: 'test@example.com',
          full_name: 'Test User',
          is_active: true
        }
      });
    }
    if (url === 'http://localhost:8000/api/quiz/history') {
      return Promise.resolve({
        data: [
          {
            topic_id: 1,
            topic_name: 'RAG Systems',
            total_questions: 5,
            correct_answers: 4,
            average_response_time: 3.5,
            completed_at: '2024-01-01T00:00:00Z'
          }
        ]
      });
    }
    return Promise.reject(new Error('Not found'));
  }),
  put: jest.fn(() => Promise.resolve({
    data: {
      id: 1,
      email: 'updated@example.com',
      full_name: 'Updated User',
      is_active: true
    }
  }))
}));

describe('Profile Component', () => {
  const renderProfile = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Profile />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders profile information', () => {
    renderProfile();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });

  it('displays user information', () => {
    renderProfile();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
  });

  it('shows quiz history', () => {
    renderProfile();
    expect(screen.getByText(/Quiz History/i)).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    renderProfile();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders user profile after loading', async () => {
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  it('renders quiz history after loading', async () => {
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('RAG Systems')).toBeInTheDocument();
      expect(screen.getByText('4/5')).toBeInTheDocument();
      expect(screen.getByText('3.5s')).toBeInTheDocument();
    });
  });

  it('handles profile editing', async () => {
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);

    // Fill in the form
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/new password/i);

    fireEvent.change(nameInput, { target: { value: 'Updated User' } });
    fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'new_password' } });

    // Submit the form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Updated User')).toBeInTheDocument();
      expect(screen.getByText('updated@example.com')).toBeInTheDocument();
    });
  });

  it('handles profile update errors', async () => {
    // Mock axios to reject update
    jest.spyOn(require('axios'), 'put').mockRejectedValueOnce(
      new Error('Update failed')
    );

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);

    // Fill in the form
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated User' } });

    // Submit the form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('handles quiz history error', async () => {
    // Mock axios to reject quiz history fetch
    jest.spyOn(require('axios'), 'get').mockRejectedValueOnce(
      new Error('Failed to fetch quiz history')
    );

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
}); 