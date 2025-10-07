import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { Logo, FormRow } from '../components';
import { Snackbar } from '@mui/material';

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const addUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/adduser`, {
        name,
        lastName,
        email,
        username,
        password,
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.msg || 'An error occurred');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Wrapper>
      <form className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow
          type="text"
          name="name"
          labelText="Name"
          value={name}
          defaultValue="John"
          onChange={(e) => setName(e.target.value)}
        />
        <FormRow
          type="text"
          name="lastName"
          labelText="Last Name"
          value={lastName}
          defaultValue="smith"
          onChange={(e) => setLastName(e.target.value)}
        />
        <FormRow
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <button type="button" className="btn btn-block" onClick={addUser}>
          submit
        </button>
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="User added successfully"
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

export default AddUser;
