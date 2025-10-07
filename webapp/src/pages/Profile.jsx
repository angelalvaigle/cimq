import { useState, useEffect } from 'react';
import axios from 'axios';
import { FormRow } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useDashboardContext } from './DashboardLayout';
import { Snackbar } from '@mui/material';

const Profile = () => {
  const { user } = useDashboardContext();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiEndpoint =
    process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  // Inicializar los estados con los valores del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setName(user.name);
      setLastName(user.lastName);
      setEmail(user.email);
      setUsername(user.username);
    }
  }, [user]);

  const updateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${apiEndpoint}/update-user`,
        { name, lastName, email, username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpenSnackbar(true);
    } catch (error) {
      setError(error?.response?.data?.msg || 'An error occurred');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Wrapper>
      <form className="form">
        <h4 className="form-title">profile</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormRow
            type="text"
            labelText="last name"
            name="lastName"
            value={lastName}
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
          <button type="button" className="btn btn-block" onClick={updateUser}>
            submit
          </button>
        </div>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="User updated successfully"
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

export default Profile;
