import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Play';
import QuestionContainer from '../components/QuestionContainer';
import ScoreContainer from '../components/ScoreContainer';
import TimerContainer from '../components/TimerContainer';
import GameOverContainer from '../components/GameOverContainer';
import useScore from '../hooks/useScore';
import { v4 as uuidv4 } from 'uuid';

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

//axios.defaults.withCredentials = true; // Permitir envío de cookies
const answerTime = 20;

export const loader = async (game) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiEndpoint}/${game}-questions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las preguntas:', error);
  }
};

const PlayGame = ({ game }) => {
  // Estados
  const [questionIndex, setQuestionIndex] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // Estado para almacenar las respuestas mezcladas
  const [score, updateScore] = useScore();
  const [previousScore, setPreviousScore] = useState(0);
  const [seconds, setSeconds] = useState(answerTime); // Estados para controlar el temporizador
  const [isActive, setIsActive] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [error, setError] = useState('');
  const [gameId] = useState(() => uuidv4());

  // Desestructuramos la pregunta
  const questions = useLoaderData();
  const { _id, name, path, hint1, hint2, right, wrong1, wrong2, wrong3 } =
    questions[questionIndex];

  // Efecto para mezclar las respuestas al montar el componente
  useEffect(() => {
    const answers = [right, wrong1, wrong2, wrong3];
    setShuffledAnswers(answers.sort(() => Math.random() - 0.5)); // Mezcla solo una vez al cargar
  }, [right, wrong1, wrong2, wrong3]);

  // Efecto para controlar el temporizador
  useEffect(() => {
    if (seconds === 0) {
      setTimer(false);
      setIsActive(false);
      setIsTimeOut(true);
    }
    if (!isActive) {
      return;
    }
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, isActive]);

  // Funciones para controlar el temporizador
  const setTimer = (state) => {
    setIsActive(state);
  };

  const restartTimer = () => {
    setSeconds(answerTime);
    setIsActive(true);
    setIsTimeOut(false);
  };

  const addQuestionStat = async () => {
    try {
      const token = localStorage.getItem('token');
      const usedTime = answerTime - seconds;
      const points = score - previousScore;
      const right = points === 300;
      setPreviousScore(score);
      await axios.post(
        `${apiEndpoint}/addstat`,
        {
          gameId: gameId,
          questionId: _id,
          right: right,
          time: usedTime,
          points: points,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  // Función para cargar la siguiente pregunta
  const loadNextQuestion = async () => {
    await addQuestionStat();
    if (questionIndex < questions.length - 1) {
      // Si no estamos en la última pregunta, avanzamos a la siguiente
      setQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Si estamos en la última pregunta, terminamos el juego
      setGameOver(true); // Cambiar estado de juego
      setSeconds(0);
    }
  };

  return (
    <Wrapper>
      {!gameOver ? (
        <>
          {/* Mostrar pregunta */}    
            <QuestionContainer
              shuffledAnswers={shuffledAnswers}
              name={name}
              right={right}
              updateScore={updateScore}
              isActive={isActive}
              isTimeOut={isTimeOut}
              setTimer={setTimer}
              restartTimer={restartTimer}
              loadNextQuestion={loadNextQuestion} // Cargar la siguiente pregunta
            />
          {/* Mostrar info */}
          <div>
            <ScoreContainer score={score} />
            <TimerContainer seconds={seconds} />
          </div>
        </>
      ) : (
        // Si el juego terminó, mostrar mensaje de fin
        <>
          <GameOverContainer score={score} />
          <div>
            <ScoreContainer score={score} />
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default PlayGame;
