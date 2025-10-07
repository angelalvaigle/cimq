import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  margin: 0.5rem auto;
  padding: 1rem;
  max-width: 700px;
  box-shadow: var(--shadow-2);
  h3,
  h5 {
    align-self: flex-start; /* Alinea el texto a la izquierda */
    margin: 0 0 1.5rem 0; /* Margen inferior para separar el texto de la imagen */
  }
  p {
    align-self: flex-start; /* Alinea el texto a la izquierda */
    margin: 1.5rem 0 0 0; /* Margen superior para separar el texto de los botones */
  }
  .image {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0 1.5rem 0; /* Margen inferior para separar la imagen de los botones*/
  }
  img {
    width: auto; // Mantiene el ratio
    max-width: 80%;
    height: auto; // Ajusta al alto del contenedor
    max-height: 500px;
    object-fit: contain; // Asegura que la imagen no se recorte ni se distorsione
  }
  .buttons-container {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Dos columnas de igual ancho */
    grid-template-rows: 1fr 1fr; /* Dos filas de igual altura */
    gap: 1rem;
  }
  .btn {
    padding: 1rem;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    border-radius: 4px;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
  .btn.correct {
    background-color: green;
    color: white;
  }
  .btn.incorrect {
    background-color: red;
    color: white;
  }
  .result {
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

export default Wrapper;
