import { useState } from 'react';
import axios from 'axios';
import Wrapper from '../assets/wrappers/MenuItem';
import { Snackbar } from '@mui/material';
import data from "../utils/data.json";

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const LoadQuestionContainer = ({ game }) => {
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadQuestion = async (question) => {
    const token = localStorage.getItem('token');
    await axios.post(`${apiEndpoint}/addquestion`, question, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const getRandomAnswers = (allAnswers, correctAnswer, count) => {
    const filteredAnswers = allAnswers.filter(
      (answer) => answer !== correctAnswer && !answer.startsWith('http')
    );
    const randomAnswers = [];
    while (randomAnswers.length < count) {
      const randomAnswer =
        filteredAnswers[Math.floor(Math.random() * filteredAnswers.length)];
      if (!randomAnswers.includes(randomAnswer)) {
        randomAnswers.push(randomAnswer);
      }
    }
    return randomAnswers;
  };

  const generateQuestions = async () => {
    setIsSubmitting(true);
    try {
      const question_data = data.questions;
      console.log(question_data);
      const allAnswers = question_data.map((q) => q.right);
      console.log(allAnswers);
      const questions = [];
      for (const question of question_data) {
        const wrongAnswers = getRandomAnswers(allAnswers, question.right, 3);

        // Añade las preguntas al array
        questions.push({
          type: question.type,
          name: question.name,
          path: question.path,
          right: question.right,
          wrong1: wrongAnswers[0],
          wrong2: wrongAnswers[1],
          wrong3: wrongAnswers[2],
        });
      }  
      await Promise.all(questions.map((q) => loadQuestion(q)));
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

export default LoadQuestionContainer;
