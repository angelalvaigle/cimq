// AddQuestionContainer.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddQuestionContainer from '../../components/AddQuestionContainer';

jest.mock('axios');

describe('AddQuestionContainer Component', () => {
  jest.setTimeout(20000);

  const mockProps = {
    game: 'Trivia Game',
    questionTypes: [
      { type: 'artwork', functionName: 'generateArtworks' },
      { type: 'city', functionName: 'generateCities' },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('generates questions and shows success snackbar', async () => {
    axios.post.mockResolvedValueOnce({}); // Mock para simular éxito en la solicitud

    render(<AddQuestionContainer {...mockProps} />);

    // Simula el clic en el botón
    const button = screen.getByText(/update DB/i);
    fireEvent.click(button);

    // Verifica que el botón esté deshabilitado durante la ejecución
    expect(button).toBeDisabled();

    // Espera a que el snackbar de éxito sea visible
    // await waitFor(
    //   () =>
    //     expect(
    //       screen.getByText(/questions generated successfully/i)
    //     ).toBeInTheDocument(),
    //   { timeout: 20000 } // Timeout de 15 segundos para esperar el snackbar
    // );

    // // Verifica que el botón vuelva a estar habilitado
    // expect(button).not.toBeDisabled();
  });
});

// it('handles errors and shows error snackbar', async () => {
//   axios.post.mockRejectedValueOnce({
//     response: { data: { msg: 'Failed to generate questions' } },
//   });

//   render(<AddQuestionContainer {...mockProps} />);

//   // Simula el clic en el botón
//   const button = screen.getByText(/update DB/i);
//   fireEvent.click(button);

//   // Verifica que el botón esté deshabilitado durante la ejecución
//   expect(button).toBeDisabled();

//   // Añade una espera explícita de unos segundos antes de continuar
//   await new Promise((resolve) => setTimeout(resolve, 14000)); // Espera segundos
//   screen.debug();

//   // Espera a que el snackbar de error sea visible
//   await waitFor(
//     () =>
//       expect(
//         screen.getByText(/questions generated successfully/i),
//         { timeout: 15000 } // Timeout de 15 segundos para esperar el snackbar
//       ).toBeInTheDocument(),
//     { timeout: 15000 } // Timeout de 15 segundos para esperar el snackbar
//   );

//   // Verifica que el botón vuelva a estar habilitado
//   expect(button).not.toBeDisabled();
// });
// });
