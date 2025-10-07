import Wrapper from '../assets/wrappers/MenuContainer';
import GameMenuItem from '../components/GameMenuItem';

const PlayContainer = () => {
  return (
    <Wrapper>
      <h5>play</h5>
      <div className="items">
        <GameMenuItem
          title="Quiz"
          description="Escoge la respuesta correcta"
          path="./game"
        />
      </div>
    </Wrapper>
  );
};

export default PlayContainer;
