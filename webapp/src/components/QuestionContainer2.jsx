import React, { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/QuestionContainer';

const QuestionContainer2 = ({
  shuffledAnswers,
  path,
  hint1,
  hint2,
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
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Efecto para reiniciar los estados cuando se carga una nueva pregunta
  useEffect(() => {
    // Restablecemos el estado al cargar una nueva pregunta
    setSelectedAnswer(null);
    setIncorrectAnswers([]);
    setShowResult(false);
  }, [right, path]);

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
        setIsImageLoaded(false);
        loadNextQuestion(); // Cargar la siguiente pregunta después del retraso
      }, 2000); // Esperar 2 segundos antes de cargar la siguiente pregunta
      setShowHint1(false);
      setShowHint2(false);
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
        if (newIncorrectAnswers.length === 1) setShowHint1(true);
        if (newIncorrectAnswers.length === 2) setShowHint2(true);
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
  const handleImageLoad = () => {
    setIsImageLoaded(true);
    // Activamos el temporizador
    setTimer(true);
    restartTimer();
  };

  return (
    <Wrapper>
      {!isImageLoaded && <div>Loading...</div>}
      {isImageLoaded && (
        /* Título de la obra */
        <h3>¿Qué ciudad se ve en la imagen?</h3>
      )}

      {/* Imagen de la obra */}
      <div
        className="image"
        style={{ display: isImageLoaded ? 'flex' : 'none' }}
      >
        <img src={path} alt={right} onLoad={handleImageLoad} />
      </div>
      {isImageLoaded && showHint1 && (
        <div>
          <h5>Tiene {hint1} habitantes.</h5>
        </div>
      )}
      {isImageLoaded && showHint2 && (
        <div>
          <h5>Se encuentra en {hint2}.</h5>
        </div>
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

export default QuestionContainer2;
