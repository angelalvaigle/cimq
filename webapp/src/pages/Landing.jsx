import Wrapper from '../assets/wrappers/LandingPage';
import main from '../assets/images/main.svg';
import { Link } from 'react-router-dom';
import { Logo } from '../components';

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1 data-testid="text-rendered">
            wiq7 <span>quiz</span> game
          </h1>
          <p>
            Sumérgete en la emoción del concurso, ahora en versión digital.
            Desafía tus conocimientos, compite con amigos y demuestra tu
            sabiduría en esta experiencia interactiva única.
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn login-link">
            Login
          </Link>
        </div>
        <img src={main} alt="wiq 7" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
