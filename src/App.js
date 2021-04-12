import firebase from "firebase/app";
import "firebase/auth";
import { FirebaseAuthProvider, FirebaseAuthConsumer } from '@react-firebase/auth';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import Login from './Login';

const config = {
  appId: "1:1096449099:web:771193a7a07667083761ce",
  apiKey: "",
  projectId: "cool-react-game",
  authDomain: "cool-react-game.firebaseapp.com",
};

console.log(config);

const App = () => (
  <div className="app">
    <FirebaseAuthProvider firebase={firebase} {...config}>
      <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
    return (
      <pre style={{ height: 300, overflow: "auto" }}>
        {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
      </pre>
    );
  }}
      </FirebaseAuthConsumer>
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
