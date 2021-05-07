import { Link } from "react-router-dom";

const Home = ({ user }) => (
  <section className='home'>
      {user && <Link className='button is-success is-medium' to='/game'>Play the Game</Link>}
      {(user === null) && <div>Please <Link to='/login'>login</Link> to play the Game</div>}
  </section>
);

export default Home;
