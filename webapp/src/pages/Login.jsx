import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { Logo, FormRow } from '../components';
import { Snackbar } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const apiEndpoint =
    process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const login = async () => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const { token } = response.data;
      localStorage.setItem('token', token); // Guarda el token
      console.log(token);
      setOpenSnackbar(true);
      // Añadir un retardo antes de navegar
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); // 1000 ms = 1 segundos
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Wrapper>
      <form className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormRow
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" className="btn btn-block" onClick={login}>
          submit
        </button>
        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Login successful"
      />
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={`Error: ${error}`}
        />
      )}
    </Wrapper>
  );
};

export default Login;
