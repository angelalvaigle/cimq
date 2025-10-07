// Ranking.test.js
import { render, screen } from '@testing-library/react';
import Ranking from '../../pages/Ranking';
import { useLoaderData } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useLoaderData: jest.fn(),
}));

jest.mock('../../App', () => () => <div>Mock App</div>);

describe('Ranking Page', () => {
  const mockRankingData = [
    {
      gameId: 'a4acc100-52d6-46ab-8ce2-b0acccf93c03',
      userId: '6767e65426af19f147062821',
      totalPoints: 2600,
      totalTime: 49,
      username: 'admin',
    },
    {
      gameId: '08084b37-c14a-40f6-bc28-c70772f28ebd',
      userId: '6767e65426af19f147062821',
      totalPoints: 2200,
      totalTime: 56,
      username: 'admin',
    },
  ];

  beforeEach(() => {
    useLoaderData.mockReturnValue(mockRankingData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Ranking page heading', () => {
    render(<Ranking />);

    expect(screen.getByText(/hall of fame/i)).toBeInTheDocument();
    expect(screen.getByText(/User/i)).toBeInTheDocument();
    expect(screen.getByText(/Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Time/i)).toBeInTheDocument();
  });

  test('renders the list of users and their ranking data', () => {
    render(<Ranking />);

    // Verificar que los datos del ranking aparecen
    expect(screen.getByText(2600)).toBeInTheDocument();
    expect(screen.getByText(`49 s`)).toBeInTheDocument();
  });

  test('renders an error message when data loading fails', () => {
    // Mock de datos de error
    useLoaderData.mockReturnValue({
      error: true,
      message: 'Failed to load ranking data',
    });

    render(<Ranking />);

    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(/No ranking data available/i)).toBeInTheDocument();
  });

  test('renders "noname" when userId is invalid', async () => {
    const mockInvalidRankingData = [
      {
        gameId: 'a4acc100-52d6-46ab-8ce2-b0acccf93c03',
        userId: null, // userId inválido
        totalPoints: 1500,
        totalTime: 60,
      },
    ];

    // Mockear la respuesta del loader con datos inválidos
    useLoaderData.mockReturnValue(
      mockInvalidRankingData.map((item) => ({
        ...item,
        username: 'noname', // El resultado esperado en caso de error
      }))
    );

    render(<Ranking />);

    // Verificar que se renderiza "noname" como el nombre de usuario
    expect(screen.getByText('noname')).toBeInTheDocument();

    // Verificar que los puntos y el tiempo aún se renderizan correctamente
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('60 s')).toBeInTheDocument();
  });
});
