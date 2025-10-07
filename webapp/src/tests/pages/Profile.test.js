// Profile.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../pages/Profile';
import { useDashboardContext } from '../../pages/DashboardLayout';
import axios from 'axios';

// Mock del contexto de Dashboard
jest.mock('../../pages/DashboardLayout', () => ({
  useDashboardContext: jest.fn(),
}));

// Mock de axios
jest.mock('axios');

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Profile component correctly', async () => {
    // Mock del contexto con datos de usuario
    useDashboardContext.mockReturnValue({
      user: {
        name: 'angel',
        lastName: 'alvarez',
        email: 'angel@example.com',
        username: 'admin',
      },
    });

    // Renderizar el componente
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Verificar que los campos del formulario se renderizan con los valores iniciales
    expect(screen.getByLabelText('name')).toHaveValue('angel');
    expect(screen.getByLabelText('last name')).toHaveValue('alvarez');
    expect(screen.getByLabelText('email')).toHaveValue('angel@example.com');
    expect(screen.getByLabelText('username')).toHaveValue('admin');

    // Simular la interacción con el botón de envío
    axios.patch.mockResolvedValueOnce({}); // Mock de la respuesta de éxito
    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);

    // Verificar que el Snackbar de éxito se muestra
    await waitFor(() =>
      expect(screen.getByText(/User updated successfully/i)).toBeInTheDocument()
    );
  });

  it('shows an error message when the update fails', async () => {
    // Mock del contexto con datos de usuario
    useDashboardContext.mockReturnValue({
      user: {
        name: 'angel',
        lastName: 'alvarez',
        email: 'angel@example.com',
        username: 'admin',
      },
    });

    // Renderizar el componente
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Simular la interacción con el botón de envío
    axios.patch.mockRejectedValueOnce({
      response: { data: { msg: 'Update failed' } },
    });
    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);

    // Verificar que el Snackbar de error se muestra
    await waitFor(() =>
      expect(screen.getByText('Error: Update failed')).toBeInTheDocument()
    );
  });
});
