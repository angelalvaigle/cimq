import React, { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/QuestionContainer';

const QuestionContainer = ({
  shuffledAnswers,
  name,
  right,
  updateScore,
  isActive,
  isTimeOut,
  setTimer,
  restartTimer,
  loadNextQuestion,
}) => {
  // Estado para manejar las respuestas seleccionadas
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  // Efecto para reiniciar los estados cuando se carga una nueva pregunta
  useEffect(() => {
    // Restablecemos el estado al cargar una nueva pregunta
    setSelectedAnswer(null);
    setIncorrectAnswers([]);
    setShowResult(false);
    setTimer(true); // Activamos el temporizador
    restartTimer(); // Reiniciamos el temporizador
  }, [right, name]);

  // Efecto para seleccionar la respuesta correcta automáticamente cuando el tiempo se agota
  useEffect(() => {
    if (isTimeOut && selectedAnswer === null) {
      setSelectedAnswer(right); // Seleccionamos la respuesta correcta
      setTimer(false); // Detenemos el temporizador
      setShowResult(true);
    }
  }, [isTimeOut]);

  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        setShowResult(false);
//        setIsImageLoaded(false);
        loadNextQuestion(); // Cargar la siguiente pregunta después del retraso
      }, 2000); // Esperar 2 segundos antes de cargar la siguiente pregunta
//      setShowHint1(false);
//      setShowHint2(false);
      return () => clearTimeout(timer); // Limpiar el temporizador cuando se desmonte o cambie el resultado
    }
  }, [showResult]); //, loadNextQuestion]);

  // Función para manejar el clic en las respuestas
  const handleAnswerClick = (answer) => {
    if (answer === right) {
      // Si la respuesta es correcta, la seleccionamos y deshabilitamos todos los botones
      setSelectedAnswer(answer);
      setTimer(false); // Detenemos el temporizador
      setShowResult(true);
      for (let i = incorrectAnswers.length; i < 3; i++) {
        updateScore();
      }
    } else {
      setIncorrectAnswers((prev) => {
        const newIncorrectAnswers = [...prev, answer];
//        if (newIncorrectAnswers.length === 1) setShowHint1(true);
//        if (newIncorrectAnswers.length === 2) setShowHint2(true);
        if (newIncorrectAnswers.length === 3) {
          // Si ya se han seleccionado 3 respuestas incorrectas, selecciona la correcta por descarte
          setSelectedAnswer(right);
          setTimer(false); // Detenemos el temporizador
          setShowResult(true);
        }
        return newIncorrectAnswers;
      });
    }
  };

  // Función para manejar la carga de la imagen
//  const handleImageLoad = () => {
    // setIsImageLoaded(true);
    // Activamos el temporizador
//    setTimer(true);
//    restartTimer();
//  };

  return (
    <Wrapper>
      {isImageLoaded && (
        /* Título de la obra */
        <h3>¿Cómo se dice {name} en inglés?</h3>
      )}

      {isImageLoaded && (
        <>
          <div>
            <h5>Marca la respuesta correcta</h5>
          </div>
          {/* Renderizar botones con las respuestas */}
          <div className="buttons-container">
            {shuffledAnswers.map((answer, index) => (
              <button
                className={`btn ${
                  selectedAnswer === right
                    ? answer === right &&
                      incorrectAnswers.length < 3 &&
                      !isTimeOut // Marca la respuesta correcta cuando se selecciona
                      ? 'correct'
                      : 'disabled' // Deshabilita las demás cuando la correcta es seleccionada
                    : incorrectAnswers.includes(answer) // Marca las respuestas incorrectas una a una
                    ? 'incorrect'
                    : ''
                }`}
                key={index}
                onClick={() => handleAnswerClick(answer)}
                disabled={
                  selectedAnswer !== null ||
                  incorrectAnswers.includes(answer) ||
                  !isActive // Deshabilita
                }
              >
                {answer}
              </button>
            ))}
          </div>
        </>
      )}
      {/* Mostrar el resultado después de seleccionar */}
      {selectedAnswer && (
        <div>
          {incorrectAnswers.length < 3 && !isTimeOut ? (
            <p style={{ color: 'green' }}>
              ¡Correcto!, la respuesta correcta es {right}.
            </p>
          ) : (
            <p style={{ color: 'red' }}>La respuesta correcta es {right}.</p>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default QuestionContainer;
