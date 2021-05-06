import { Link } from "react-router-dom";
import UserProfile from './UserProfile';

const Navigation = ({ onLogout, user }) => (
    <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <Link className='navbar-item' to='/'>
                Tetris
            </Link>
            <div className='links'>
                {(user === null) && <Link to='/login'>Login</Link>}
                {(user === null) && <Link to='/signup'>Signup</Link>}
                {user && <button className='button' onClick={onLogout}>Logout</button>}
                {user && <UserProfile user={user} />}
            </div>
        </div>
    </nav>
);

export default Navigation;
