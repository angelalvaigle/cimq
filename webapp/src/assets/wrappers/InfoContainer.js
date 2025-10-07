import styled from 'styled-components';

const Wrapper = styled.div`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  margin: 0.5rem auto;
  padding: 1.5rem;
  min-width: 175px;
  box-shadow: var(--shadow-2);
  h5 {
    align-self: flex-start; /* Alinea el texto a la izquierda */
  }
`;

export default Wrapper;
