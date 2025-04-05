import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Navbar from './Navbar';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Navbar Component', () => {
  const renderNavbar = () => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders navigation links', () => {
    renderNavbar();
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('navigates to correct routes when clicking links', () => {
    renderNavbar();
    
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');

    fireEvent.click(screen.getByText('Topics'));
    expect(mockNavigate).toHaveBeenCalledWith('/topics');

    fireEvent.click(screen.getByText('Login'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    fireEvent.click(screen.getByText('Register'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('shows user menu when logged in', async () => {
    // Mock the auth context to simulate logged in state
    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      user: {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        is_active: true
      },
      logout: jest.fn()
    }));

    renderNavbar();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('handles logout', async () => {
    const mockLogout = jest.fn();
    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      user: {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        is_active: true
      },
      logout: mockLogout
    }));

    renderNavbar();

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to profile when clicking profile link', async () => {
    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      user: {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        is_active: true
      },
      logout: jest.fn()
    }));

    renderNavbar();

    fireEvent.click(screen.getByText('Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('toggles mobile menu', () => {
    renderNavbar();

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    // Check if mobile menu is visible
    expect(screen.getByRole('navigation')).toHaveClass('block');
  });
}); 