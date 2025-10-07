// QuestionCnatiner2.test.js
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import QuestionContainer2 from '../../components/QuestionContainer2';

describe('QuestionContainer2 Component', () => {
  const mockProps = {
    shuffledAnswers: ['New York', 'Paris', 'Tokyo', 'Sydney'],
    path: '/images/tokyo.jpg',
    hint1: '37 millones',
    hint2: 'Asia',
    right: 'Tokyo',
    updateScore: jest.fn(),
    isActive: true,
    isTimeOut: false,
    setTimer: jest.fn(),
    restartTimer: jest.fn(),
    loadNextQuestion: jest.fn(),
  };

  it('renders loading state initially', () => {
    render(<QuestionContainer2 {...mockProps} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders question and image after image load', async () => {
    render(<QuestionContainer2 {...mockProps} />);

    // Simula la carga de la imagen
    const image = screen.getByAltText('Tokyo');
    fireEvent.load(image);

    expect(
      screen.getByText(/Qué ciudad se ve en la imagen\?/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('displays correct answer after selecting 3 incorrect answers', async () => {
    render(<QuestionContainer2 {...mockProps} />);
    const image = screen.getByAltText('Tokyo');
    fireEvent.load(image);

    const buttons = screen.getAllByRole('button');

    // Simula seleccionar respuestas incorrectas
    fireEvent.click(buttons[0]); // New York
    fireEvent.click(buttons[1]); // Paris
    fireEvent.click(buttons[3]); // Sydney

    screen.debug();

    await waitFor(() =>
      expect(
        screen.getByText(/La respuesta correcta es Tokyo/i)
      ).toBeInTheDocument()
    );
  });

  it('calls loadNextQuestion after result delay', async () => {
    jest.useFakeTimers();

    render(<QuestionContainer2 {...mockProps} />);
    const image = screen.getByAltText('Tokyo');
    fireEvent.load(image);

    fireEvent.click(screen.getAllByRole('button')[2]); // Simula un clic en "Tokyo"

    await waitFor(() =>
      expect(
        screen.getByText(/La respuesta correcta es Tokyo./i)
      ).toBeInTheDocument()
    );

    jest.advanceTimersByTime(2000); // Simula pasar 2 segundos

    expect(mockProps.loadNextQuestion).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
