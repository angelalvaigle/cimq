// Login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/Login'; // Ajusta la ruta a tu archivo
import { BrowserRouter } from 'react-router-dom';

// Mock para axios
jest.mock('axios');

// Test para Login
describe('Login component', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Verificamos que los elementos están en pantalla
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('username')).toBeInTheDocument();
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });
});
// it('submits the form and redirects to dashboard on success', async () => {
//   // Configuramos el mock de axios para simular una respuesta exitosa
//   axios.post.mockResolvedValueOnce({
//     data: { token: 'fakeToken' },
//   });

//   render(
//     <BrowserRouter>
//       <Login />
//     </BrowserRouter>
//   );

//   // Simulamos el ingreso de texto en los campos de username y password
//   fireEvent.change(screen.getByLabelText('username'), {
//     target: { value: 'testuser' },
//   });
//   fireEvent.change(screen.getByLabelText('password'), {
//     target: { value: 'password123' },
//   });

//   // Simulamos el click en el botón de submit
//   fireEvent.click(screen.getByRole('button', { name: /submit/i }));

//   // Esperamos que la solicitud axios se haya realizado correctamente
//   await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

//   // Verificamos que el mensaje de éxito aparezca en el Snackbar
//   expect(screen.getByText('Login successful')).toBeInTheDocument();

//   // Verificamos que el redireccionamiento a /dashboard haya ocurrido después de un segundo
//   await waitFor(() => expect(window.location.pathname).toBe('/dashboard'), {
//     timeout: 1500,
//   });
// });

//   it('shows error Snackbar when login fails', async () => {
//     // Configuramos el mock de axios para simular una respuesta con error
//     axios.post.mockRejectedValueOnce({
//       response: { data: { error: 'Invalid credentials' } },
//     });

//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     // Simulamos el ingreso de texto en los campos de username y password
//     fireEvent.change(screen.getByPlaceholderText(/username/i), {
//       target: { value: 'wronguser' },
//     });
//     fireEvent.change(screen.getByPlaceholderText(/password/i), {
//       target: { value: 'wrongpassword' },
//     });

//     // Simulamos el click en el botón de submit
//     fireEvent.click(screen.getByRole('button', { name: /submit/i }));

//     // Esperamos que la solicitud axios se haya realizado correctamente
//     await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

//     // Verificamos que el mensaje de error aparezca en el Snackbar
//     expect(screen.getByText(/Error: Invalid credentials/i)).toBeInTheDocument();
//   });

//   it('closes the error snackbar when closed', async () => {
//     // Configuramos el mock de axios para simular una respuesta con error
//     axios.post.mockRejectedValueOnce({
//       response: { data: { error: 'Invalid credentials' } },
//     });

//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     // Simulamos el ingreso de texto en los campos de username y password
//     fireEvent.change(screen.getByPlaceholderText(/username/i), {
//       target: { value: 'wronguser' },
//     });
//     fireEvent.change(screen.getByPlaceholderText(/password/i), {
//       target: { value: 'wrongpassword' },
//     });

//     // Simulamos el click en el botón de submit
//     fireEvent.click(screen.getByRole('button', { name: /submit/i }));

//     // Esperamos que la solicitud axios se haya realizado correctamente
//     await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

//     // Verificamos que el mensaje de error aparece
//     const errorSnackbar = screen.getByText(/Error: Invalid credentials/i);
//     expect(errorSnackbar).toBeInTheDocument();

//     // Cerramos el Snackbar de error
//     fireEvent.click(errorSnackbar);

//     // Verificamos que el Snackbar de error haya desaparecido
//     expect(errorSnackbar).not.toBeInTheDocument();
//   });
// });
