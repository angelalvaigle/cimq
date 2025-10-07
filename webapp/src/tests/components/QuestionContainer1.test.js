// QuestionCnatiner1.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuestionContainer1 from '../../components/QuestionContainer1';

describe('QuestionContainer1 Component', () => {
  const mockProps = {
    shuffledAnswers: ['Da Vinci', 'Van Gogh', 'Picasso', 'Rembrandt'],
    name: 'Mona Lisa',
    path: '/images/mona-lisa.jpg',
    right: 'Da Vinci',
    updateScore: jest.fn(),
    isActive: true,
    isTimeOut: false,
    setTimer: jest.fn(),
    restartTimer: jest.fn(),
    loadNextQuestion: jest.fn(),
  };

  it('renders loading state initially', () => {
    render(<QuestionContainer1 {...mockProps} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders question and image after image load', async () => {
    render(<QuestionContainer1 {...mockProps} />);

    // Simula la carga de la imagen
    const image = screen.getByAltText('Mona Lisa');
    fireEvent.load(image);

    expect(
      screen.getByText(/¿Quién creo la obra Mona Lisa\?/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('displays correct answer after selecting 3 incorrect answers', async () => {
    render(<QuestionContainer1 {...mockProps} />);
    const image = screen.getByAltText('Mona Lisa');
    fireEvent.load(image);

    const buttons = screen.getAllByRole('button');

    // Simula seleccionar respuestas incorrectas
    fireEvent.click(buttons[1]); // Van Gogh
    fireEvent.click(buttons[2]); // Picasso
    fireEvent.click(buttons[3]); // Rembrandt

    await waitFor(() =>
      expect(
        screen.getByText(/¡Correcto,! Da Vinci es el creador de "Mona Lisa"/i)
      ).toBeInTheDocument()
    );

    // Verifica que updateScore fue llamado tres veces
    expect(mockProps.updateScore).toHaveBeenCalledTimes(3);
  });

  it('displays correct answer immediately on timeout', async () => {
    render(<QuestionContainer1 {...{ ...mockProps, isTimeOut: true }} />);
    const image = screen.getByAltText('Mona Lisa');
    fireEvent.load(image);

    await waitFor(() =>
      expect(
        screen.getByText(/Da Vinci es el creador de "Mona Lisa"/i)
      ).toBeInTheDocument()
    );

    expect(mockProps.setTimer).toHaveBeenCalledWith(false);
  });

  it('calls loadNextQuestion after result delay', async () => {
    jest.useFakeTimers();

    render(<QuestionContainer1 {...mockProps} />);
    const image = screen.getByAltText('Mona Lisa');
    fireEvent.load(image);

    fireEvent.click(screen.getAllByRole('button')[0]); // Da Vinci

    await waitFor(() =>
      expect(
        screen.getByText(/Da Vinci es el creador de "Mona Lisa"/i)
      ).toBeInTheDocument()
    );

    jest.advanceTimersByTime(10000); // Simula pasar 5 segundos

    expect(mockProps.loadNextQuestion).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
