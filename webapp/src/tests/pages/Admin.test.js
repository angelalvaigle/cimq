// Admin.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Admin from '../../pages/Admin';

jest.mock('react-router-dom', () => ({
  useLoaderData: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
}));

jest.mock('../../App', () => () => <div>Mock App</div>);

describe('Admin Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('redirects non-admin users to the dashboard', async () => {
    const mockUser = { role: 'user' };
    useLoaderData.mockReturnValue({ user: mockUser });

    render(<Admin />);

    expect(
      screen.getByText(/error: you are not authorized to view this page/i)
    ).toBeInTheDocument();
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      },
      { timeout: 3000 }
    );
  });

  it('renders AddQuestionContainer for admin users', () => {
    const mockUser = { role: 'admin' };
    useLoaderData.mockReturnValue({ user: mockUser });

    render(<Admin />);

    expect(screen.getByText(/Por su obra\.\.\./i)).toBeInTheDocument(); // AddQuestionContainer para artworks
    expect(screen.getByText(/Descubriendo ciudades/i)).toBeInTheDocument(); // AddQuestionContainer para cities
  });

  it('shows error snackbar when an error occurs during loader', async () => {
    localStorage.setItem('admLoaderError', 'An error occurred during loading');
    const mockUser = { role: 'admin' };
    useLoaderData.mockReturnValue({ user: mockUser });

    render(<Admin />);

    await waitFor(() =>
      expect(
        screen.getByText(/error: an error occurred during loading/i)
      ).toBeInTheDocument()
    );

    localStorage.removeItem('admLoaderError');
  });
});
