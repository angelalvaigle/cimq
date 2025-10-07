import { FaStar } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/RankingContainer';

const StatsContainer = ({ ranking }) => {
  const rankingData = ranking;

  return (
    <Wrapper>
      {rankingData && rankingData.length > 0 ? (
        <>
          <div className="header-container">
            <FaStar className="star-icon" />
            <h5>Hall of Fame</h5>
            <FaStar className="star-icon" />
          </div>
          <div className="list">
            <div className="list-item headers">
              <span>
                <strong>Position</strong>
              </span>
              <span>
                <strong>User </strong>
              </span>
              <span>
                <strong>Score </strong>
              </span>
              <span>
                <strong>Time </strong>
              </span>
            </div>
            {rankingData.map((entry, index) => (
              <div
                className="list-item"
                key={`${entry.gameId}-${entry.userId}`}
              >
                <span>
                  <strong>{index + 1}.</strong>
                </span>
                <span>{entry.username} </span>
                <span>{entry.totalPoints} </span>
                <span>{entry.totalTime} s</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No ranking data available</p>
      )}
    </Wrapper>
  );
};

export default StatsContainer;
