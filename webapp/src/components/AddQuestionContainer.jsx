import React, { useState } from 'react';
import axios from 'axios';
import Wrapper from '../assets/wrappers/MenuItem';
import { Snackbar } from '@mui/material';
import { paintingsQuery, sculpturesQuery } from '../utils/artworksQuery';
import citiesQuery from '../utils/citiesQuery';
import { generateArtworks, generateCities } from '../utils/generateFunction';

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddQuestionContainer = ({ game, questionTypes }) => {
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = async (question) => {
    const token = localStorage.getItem('token');
    await axios.post(`${apiEndpoint}/addquestion`, question, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Mapa de funciones
  const functionMap = {
    generateArtworks,
    generateCities,
  };

  const generateQuestions = async () => {
    setIsSubmitting(true);
    try {
      for (const { type, functionName } of questionTypes) {
        const generatorFunction = functionMap[functionName];
        if (generatorFunction) {
          const queries =
            type === 'artwork'
              ? [paintingsQuery, sculpturesQuery] // Ejecutar ambas queries para artwork
              : type === 'city'
              ? [citiesQuery] // Ejecutar citiesQuery para city
              : [];

          // Iterar sobre cada query y ejecutar la función generadora
          for (const query of queries) {
            const questions = await generatorFunction(query);
            await Promise.all(questions.map((q) => addQuestion(q)));
          }
        }
      }
      setOpenSnackbar(true);
    } catch (error) {
      setError(
        error.response?.data?.msg ||
          'An error occurred when generating the questions'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Wrapper>
      <header>
        <div className="info">
          <h5>Update {game}</h5>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <p>Add questions to the database</p>
        </div>
        <footer className="actions">
          <button
            type="submit"
            className="btn update-btn"
            onClick={generateQuestions}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'updating...' : 'update DB'}
          </button>
        </footer>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Questions generated successfully"
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

export default AddQuestionContainer;
