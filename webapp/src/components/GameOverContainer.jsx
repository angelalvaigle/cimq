import React from 'react';
import Wrapper from '../assets/wrappers/InfoContainer';

const GameOverContainer = ({ score }) => {
  return (
    <Wrapper>
      <div className="score">
        <h1>Game Over</h1>
      </div>
    </Wrapper>
  );
};

export default GameOverContainer;
