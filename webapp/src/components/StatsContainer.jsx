import {
  FaGamepad,
  FaStar,
  FaCheckCircle,
  FaBug,
  FaCalendarCheck,
} from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import StatItem from './StatItem';

const StatsContainer = ({ userStats }) => {
  const stats = [
    {
      title: 'total games',
      count: userStats?.totalGames || 0,
      icon: <FaGamepad />,
      color: '#f59e0b',
      bcg: '#fef3c7',
    },
    {
      title: 'points',
      count: userStats?.totalPoints || 0,
      icon: <FaStar />,
      color: '#f1ee24',
      bcg: '#fef3c7',
    },
    {
      title: 'playing time (s)',
      count: userStats?.totalTime || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#fef3c7',
    },
    {
      title: 'correct answers',
      count: userStats?.correctAnswers || 0,
      icon: <FaCheckCircle />,
      color: '#1fb41f',
      bcg: '#fef3c7',
    },
    {
      title: 'incorrect answers',
      count: userStats?.wrongAnswers || 0,
      icon: <FaBug />,
      color: '#d66a6a',
      bcg: '#fef3c7',
    },
  ];

  return (
    <Wrapper>
      {stats.map((item) => {
        return <StatItem key={item.title} {...item} />;
      })}
    </Wrapper>
  );
};

export default StatsContainer;
