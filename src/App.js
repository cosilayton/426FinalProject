import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import Login from './Login';

const App = () => (
  <div className="app">
    <Router>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
      </nav>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  </div>
);

export default App;
