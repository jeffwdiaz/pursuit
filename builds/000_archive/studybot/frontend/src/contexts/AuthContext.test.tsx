import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn((url, data) => {
    if (url === 'http://localhost:8000/api/users/token') {
      return Promise.resolve({
        data: {
          access_token: 'test_token',
          token_type: 'bearer'
        }
      });
    }
    if (url === 'http://localhost:8000/api/users/register') {
      return Promise.resolve({
        data: {
          id: 1,
          email: data.email,
          full_name: data.full_name,
          is_active: true
        }
      });
    }
    return Promise.reject(new Error('Not found'));
  }),
  get: jest.fn(() => Promise.resolve({
    data: {
      id: 1,
      email: 'test@example.com',
      full_name: 'Test User',
      is_active: true
    }
  }))
}));

const TestComponent = () => {
  const { user, login, register, logout } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => login('test@example.com', 'password')}>
            Login
          </button>
          <button
            onClick={() =>
              register('test@example.com', 'password', 'Test User')
            }
          >
            Register
          </button>
        </>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  it('provides login functionality', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Logged in as: test@example.com/)).toBeInTheDocument();
    });
  });

  it('provides registration functionality', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/Logged in as: test@example.com/)).toBeInTheDocument();
    });
  });

  it('provides logout functionality', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Logged in as: test@example.com/)).toBeInTheDocument();
    });

    // Then logout
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });

  it('handles login errors', async () => {
    // Mock axios to reject login
    jest.spyOn(require('axios'), 'post').mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });

  it('handles registration errors', async () => {
    // Mock axios to reject registration
    jest.spyOn(require('axios'), 'post').mockRejectedValueOnce(
      new Error('Email already registered')
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('Register')).toBeInTheDocument();
    });
  });
}); 