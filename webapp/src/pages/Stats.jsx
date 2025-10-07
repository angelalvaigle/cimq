import { StatsContainer } from '../components';
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import Wrapper from '../assets/wrappers/MenuContainer';

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const loader = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiEndpoint}/user-stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

const Stats = () => {
  const userStats = useLoaderData();
  return (
    <Wrapper>
      <h5>user stats</h5>
      <StatsContainer userStats={userStats} />
    </Wrapper>
  );
};

export default Stats;
