// DashboardLayout.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout, {
  loader as dashboardLoader,
} from '../../pages/DashboardLayout';

// Mock de componentes secundarios
jest.mock('../../components/SmallSidebar', () => () => <div>SmallSidebar</div>);
jest.mock('../../components/BigSidebar', () => () => <div>BigSidebar</div>);
//jest.mock('../../components/Navbar', () => () => <div>Navbar</div>);

jest.mock('axios');

describe('DashboardLayout Component', () => {
  const mockUser = { name: 'angel', role: 'admin' };

  const routes = [
    {
      path: '/',
      element: <DashboardLayout />,
      loader: dashboardLoader,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'mockToken'); // Simula el token para los tests
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('renders correctly with user data', async () => {
    axios.get.mockResolvedValueOnce({ data: { user: mockUser } });

    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);

    // Espera a que el usuario sea cargado
    await waitFor(() =>
      expect(screen.getByText(/wiq7\s*quiz\s*game/i)).toBeInTheDocument()
    );

    expect(screen.getByText('SmallSidebar')).toBeInTheDocument();
    expect(screen.getByText('BigSidebar')).toBeInTheDocument();
    expect(screen.getByText(/wiq7\s*quiz\s*game/i)).toBeInTheDocument();
  });

  it('logs out and redirects to login', async () => {
    axios.get.mockResolvedValueOnce({ data: { user: mockUser } });
    axios.get.mockResolvedValueOnce({}); // Simula una respuesta exitosa de logout

    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);

    await waitFor(() =>
      expect(screen.getByText(/wiq7\s*quiz\s*game/i)).toBeInTheDocument()
    );

    // Verifica que el token está en el localStorage antes del logout
    expect(localStorage.getItem('token')).toBe('mockToken');

    // Llama a la función de logout
    fireEvent.click(screen.getByText(/logout/i));

    // Espera que el Snackbar de logout exitoso se muestre
    await waitFor(() =>
      expect(screen.getByText(/Logout successful/i)).toBeInTheDocument()
    );

    // Verifica que el token se haya eliminado del localStorage
    expect(localStorage.getItem('token')).toBeNull();

    // Espera el retraso antes de verificar el redireccionamiento
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
  });
});
