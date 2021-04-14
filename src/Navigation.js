import { Link } from "react-router-dom";

const Navigation = ({ user }) => (
    <nav>
      <Link to='/'>Home</Link>
      {(user === null) && <Link to='/login'>Login</Link>}
      {user && <button>Logout</button>}
    </nav>
);

export default Navigation;
