import React from 'react';
import Wrapper from '../assets/wrappers/InfoContainer';

const TimerContainer = ({ seconds }) => {
  return (
    <Wrapper>
      <h5>Time: {seconds}</h5>
    </Wrapper>
  );
};

export default TimerContainer;
