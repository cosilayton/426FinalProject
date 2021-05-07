import { Link } from "react-router-dom";

const Home = ({ user }) => (
  <section className='home'>
      {user && <Link className='button is-success' to='/game'>Play the Game</Link>}
      {(user === null) && <span>Please <Link to='/login'>login</Link> to play the Game</span>}
  </section>
);

export default Home;
