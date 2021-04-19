import { Link } from "react-router-dom";

const Navigation = ({ onLogout, user }) => (
    <nav>
      <Link to='/'>Home</Link>
      {(user === null) && <Link to='/login'>Login</Link>}
      {user && <button onClick={onLogout}>Logout</button>}
    </nav>
);

export default Navigation;
