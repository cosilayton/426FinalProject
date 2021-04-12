import firebase from "firebase/app";
import "firebase/auth";
import { FirebaseAuthProvider } from '@react-firebase/auth';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import Login from './Login';

const config = {
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: "cool-react-game",
  authDomain: "cool-react-game.firebaseapp.com",
};

const App = () => (
  <div className="app">
    <FirebaseAuthProvider firebase={firebase} {...config}>
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
    </FirebaseAuthProvider>
  </div>
);

export default App;
