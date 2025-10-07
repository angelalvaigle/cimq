import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/MenuContainer';
import { Snackbar } from '@mui/material';
import { LoadQuestionContainer } from '../components';
import { UnauthenticatedError } from '../errors/customErrors.js';

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const loader = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiEndpoint}/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error || 'An error occurred';
    localStorage.setItem('admLoaderError', errorMsg);
    return null;
  }
};

const Admin = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const artworksQuestions = [
    { type: 'artwork', functionName: 'generateArtworks' },
  ];
  const citiesQuestions = [{ type: 'city', functionName: 'generateCities' }];

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const admLoaderError = localStorage.getItem('admLoaderError');
    if (admLoaderError) {
      setError(admLoaderError);
      setOpenSnackbar(true);
      localStorage.removeItem('admLoaderError');
    }
    try {
      if (user.role !== 'admin')
        throw new UnauthenticatedError(
          'You are not authorized to view this page'
        );
    } catch (error) {
      setError(error);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }
  }, [navigate]);

  return (
    <Wrapper>
      <h5>admin</h5>
      {!error && (
        <div className="items">
          <LoadQuestionContainer
            game="Test"
          />
        </div>
      )}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => {
            setError('');
            handleCloseSnackbar();
          }}
          message={`Error: ${error}`}
        />
      )}
    </Wrapper>
  );
};

export default Admin;
