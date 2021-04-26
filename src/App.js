import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import Firebase from './firebase';
import Game from './Game';
import Home from './Home';
import Login from './Login';
import Navigation from './Navigation';
import SignUp from './SignUp'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: undefined
        };
    }

    componentDidMount() {
        Firebase.auth().onAuthStateChanged(user => {
            console.log('auth changed to:', user);
            this.setState({ user });
        });
    }

    onLogout() {
        Firebase.auth().signOut();
    }

    render() {
        const { user } = this.state;
        return (
            <div className="app">
                <Router>
                  <Navigation user={user} onLogout={this.onLogout} />
                  <Switch>
                    <Route path="/game">
                      <Game />
                    </Route>
                    <Route path="/login">
                      {user ? <Redirect to='/' /> : <Login />}
                    </Route>
                    <Route path="/signup">
                      {user ? <Redirect to='/' /> : <SignUp />}
                    </Route>
                    <Route path="/">
                      <Home />
                    </Route>
                  </Switch>
                </Router>
            </div>
        );
   }
}

export default App;
