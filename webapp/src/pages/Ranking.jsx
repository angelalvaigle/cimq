import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import RankingContainer from '../components/RankingContainer';
import Wrapper from '../assets/wrappers/MenuContainer';

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const loader = async () => {
  try {
    const response = await axios.get(`${apiEndpoint}/ranking`);
    const rankingData = response.data.topRanking;

    // Obtener usernames
    const userRanking = await Promise.all(
      rankingData.map(async (item) => {
        try {
          // Verifica si userId es válido
          if (!item.userId) {
            throw new Error('Invalid userId');
          }
          const userResponse = await axios.get(`${apiEndpoint}/user`, {
            params: { userId: item.userId.toString() },
          });
          return {
            ...item,
            username: userResponse.data.username,
          };
        } catch (error) {
          console.error(
            `Error fetching username for userId: ${item.userId}`,
            error.message
          );
          return { ...item, username: 'noname' };
        }
      })
    );
    return userRanking;
  } catch (error) {
    console.error('Error loading ranking data:', error); // Detalles del error
    return { error: true, message: 'Failed to load ranking data' };
  }
};

const Ranking = () => {
  const ranking = useLoaderData();
  return (
    <Wrapper>
      <RankingContainer ranking={ranking} />
    </Wrapper>
  );
};

export default Ranking;
