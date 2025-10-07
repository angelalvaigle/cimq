import React from 'react';
import Wrapper from '../assets/wrappers/InfoContainer';

const ScoreContainer = ({ score }) => {
  return (
    <Wrapper>
      <div className="score">
        <h5>Score: {score}</h5>
      </div>
    </Wrapper>
  );
};

export default ScoreContainer;
