// AddUser.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import axios from 'axios';
import AddUser from '../../pages/AddUser';

jest.mock('axios');

describe('AddUser Component', () => {
  const routes = [
    {
      path: '/register',
      element: <AddUser />,
    },
    {
      path: '/login',
      element: <div>Login Page</div>,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the registration form', () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/register'],
    });
    render(<RouterProvider router={router} />);

    // Verifica que todos los elementos del formulario estén presentes
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  it('handles successful user registration', async () => {
    axios.post.mockResolvedValueOnce({}); // Mock de una respuesta exitosa

    const router = createMemoryRouter(routes, {
      initialEntries: ['/register'],
    });
    render(<RouterProvider router={router} />);

    // Completa el formulario
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'angel' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'alvarez' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'angel@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'angel' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    // Simula el clic en el botón de enviar
    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);

    // Verifica que se muestre el snackbar de éxito
    await waitFor(() =>
      expect(screen.getByText(/User added successfully/i)).toBeInTheDocument()
    );

    // Verifica que el usuario sea redirigido a '/login'
    await waitFor(() =>
      expect(screen.getByText(/Login Page/i)).toBeInTheDocument()
    );
  });

  it('handles registration errors', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { msg: 'Registration failed' } },
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/register'],
    });
    render(<RouterProvider router={router} />);

    // Completa el formulario
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'angel' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'alvarez' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'angel@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'angel' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    // Simula el clic en el botón de enviar
    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);

    // Verifica que se muestre el snackbar de error
    await waitFor(() =>
      expect(
        screen.getByText(/Error: Registration failed/i)
      ).toBeInTheDocument()
    );
  });
});
