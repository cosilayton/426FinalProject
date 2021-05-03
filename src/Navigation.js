import { Link } from "react-router-dom";
import UserProfile from './UserProfile';

const Navigation = ({ onLogout, user }) => (
    <nav>
      <Link to='/'>Home</Link>
      {(user === null) && <Link to='/login'>Login</Link>}
      {(user === null) && <Link to='/signup'>Signup</Link>}
      {user && <button className='button' onClick={onLogout}>Logout</button>}
      {user && <UserProfile user={user} /> }
    </nav>
);

export default Navigation;
