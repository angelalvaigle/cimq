import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex; /* Usamos flexbox */
  flex-direction: row;
  justify-content: flex-start; /* Alinea los elementos en el inicio (izquierda) */
  border-radius: var(--border-radius);
  margin: 0.5rem auto;
  padding: 1rem;
  max-width: 1200px;

  h5 {
    align-self: flex-start; /* Alinea el texto a la izquierda */
  }
`;

export default Wrapper;
