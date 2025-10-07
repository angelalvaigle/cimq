import styled from 'styled-components';

const Wrapper = styled.div`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  text-align: center;
  align-items: center;
  padding: 1rem;
  box-shadow: var(--shadow-2);

  .header-container {
    display: flex;
    justify-content: center;
    text-align: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .star-icon {
    color: #f1ee24;
    font-size: 24px;
  }

  & > h5 {
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .list-item {
    display: flex;
    line-height: 1.5;
    justify-content: space-between;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text-secondary-color);
    gap: 1rem;
  }
  .list-item span {
    flex: 1; /* Hace que cada span ocupe la misma cantidad de espacio */
    text-align: center; /* Opcional: Centra el texto dentro de cada columna */
  }
`;

export default Wrapper;
