import { Link } from "react-router-dom";

const Home = ({ user }) => (
  <section>
      <h1 className='title'>Reactive Tetris</h1>
      {user && <Link to='/game'>Play the Game</Link>}
      {(user === null) && <span>Please <Link to='/login'>login</Link> to play the Game</span>}
  </section>
);

export default Home;
