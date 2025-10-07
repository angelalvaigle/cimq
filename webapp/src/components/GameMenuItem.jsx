import { Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/MenuItem';

const GameMenuItem = ({ title, description, path }) => {
  return (
    <Wrapper>
      <header>
        <div className="info">
          <h5>{title}</h5>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <p>{description}</p>
        </div>
        <footer className="actions">
          <Link to={path} className="btn play-btn">
            Play Game {path[path.length - 1]}
          </Link>
        </footer>
      </div>
    </Wrapper>
  );
};

export default GameMenuItem;
