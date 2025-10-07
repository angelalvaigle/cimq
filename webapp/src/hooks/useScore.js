import { useState } from 'react';

const useScore = () => {
  const [score, setScore] = useState(0);

  const updateScore = () => {
    setScore((prevScore) => prevScore + 100);
  };

  return [score, updateScore];
};

export default useScore;
