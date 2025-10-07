// PlayGame.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useLoaderData } from 'react-router-dom';
import PlayGame from '../../pages/PlayGame';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock de useLoaderData
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn(),
}));

// Mock de axios
const mockAxios = new MockAdapter(axios);

jest.mock('axios');

describe('PlayGame component', () => {
  const mockQuestions = [
    {
      _id: '1',
      name: 'Question 1',
      path: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Bangui_City_Centre.jpg',
      hint1: 'Hint 1',
      hint2: 'Hint 2',
      right: 'Correct Answer 1',
      wrong1: 'Wrong Answer 1',
      wrong2: 'Wrong Answer 2',
      wrong3: 'Wrong Answer 3',
    },
    {
      _id: '2',
      name: 'Question 2',
      path: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Bangui_City_Centre.jpg',
      hint1: 'Hint 1',
      hint2: 'Hint 2',
      right: 'Correct Answer 2',
      wrong1: 'Wrong Answer 1',
      wrong2: 'Wrong Answer 2',
      wrong3: 'Wrong Answer 3',
    },
  ];

  beforeEach(() => {
    useLoaderData.mockReturnValue(mockQuestions);
    mockAxios.reset();
  });

  jest.setTimeout(15000);

  it('game 1 - renders the first question and timer', async () => {
    render(<PlayGame game="game1" />);

    // Aquí forzamos que isImageLoaded se ponga a true
    const imageElement = screen.getByAltText('Question 1');

    // Puedes hacer que el estado isImageLoaded sea true directamente
    await waitFor(() => {
      // Simulamos que la imagen está cargada inmediatamente
      fireEvent.load(imageElement);
    });

    expect(screen.getByText(/Question 1/i)).toBeInTheDocument();

    // Verificar las respuestas mezcladas
    const answers = screen.getAllByRole('button');
    expect(answers).toHaveLength(4);

    // Verificar el temporizador
    await waitFor(
      () => {
        expect(screen.getByText(/15/i)).toBeInTheDocument(); // Temporizador inicial de 20 segundos
      },
      { timeout: 15000 }
    );
  });

  it('game 2 - renders the first question and timer', async () => {
    render(<PlayGame game="game2" />);

    // Aquí forzamos que isImageLoaded se ponga a true
    const imageElement = screen.getByAltText('Correct Answer 1');

    // Puedes hacer que el estado isImageLoaded sea true directamente
    await waitFor(() => {
      // Simulamos que la imagen está cargada inmediatamente
      fireEvent.load(imageElement);
    });

    expect(screen.getByText(/Correct Answer 1/i)).toBeInTheDocument();

    // Verificar las respuestas mezcladas
    const answers = screen.getAllByRole('button');
    expect(answers).toHaveLength(4);

    // Verificar el temporizador
    await waitFor(
      () => {
        expect(screen.getByText(/15/i)).toBeInTheDocument(); // Temporizador inicial de 20 segundos
      },
      { timeout: 15000 }
    );
  });
});

it('advances to the next question on correct answer', async () => {
  useLoaderData.mockReturnValue([
    {
      _id: 'q1',
      name: 'Question 1',
      path: 'game1',
      hint1: 'Hint 1',
      hint2: 'Hint 2',
      right: 'Correct Answer 1',
      wrong1: 'Wrong Answer 1',
      wrong2: 'Wrong Answer 2',
      wrong3: 'Wrong Answer 3',
    },
    {
      _id: 'q2',
      name: 'Question 2',
      path: 'game1',
      hint1: 'Hint 1',
      hint2: 'Hint 2',
      right: 'Correct Answer 2',
      wrong1: 'Wrong Answer 1',
      wrong2: 'Wrong Answer 2',
      wrong3: 'Wrong Answer 3',
    },
  ]);
  axios.post.mockResolvedValueOnce({ data: { success: true } });

  render(<PlayGame game="game1" />);

  // Aquí forzamos que isImageLoaded se ponga a true
  const imageElement = screen.getByAltText('Question 1');
  // Puedes hacer que el estado isImageLoaded sea true directamente
  await waitFor(() => {
    // Simulamos que la imagen está cargada inmediatamente
    fireEvent.load(imageElement);
  });

  // Seleccionar la respuesta correcta y simular clic
  const correctAnswerButton = screen.getByText(/Correct Answer 1/i);
  fireEvent.click(correctAnswerButton);

  await new Promise((resolve) => setTimeout(resolve, 3000));
  // Simulamos que la imagen está cargada inmediatamente
  fireEvent.load(imageElement);

  // Verificar que avanza a la siguiente preguntac
  await waitFor(
    () => {
      expect(screen.getByAltText(/Question 2/i)).toBeInTheDocument();
    },
    { timeout: 15000 }
  );
});
