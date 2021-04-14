import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Firebase from './firebase';
import Game from './Game';
import Home from './Home';
import Login from './Login';
import Navigation from './Navigation';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: undefined
        };
    }

    componentDidMount() {
        Firebase.auth().onAuthStateChanged(user => this.setState({ user }));
    }

    render() {
        const { user } = this.state;
        return (
            <div className="app">
                <Router>
                  <Navigation user={user} />
                  <Switch>
                    <Route path="/game">
                      <Game />
                    </Route>
                    {user === null &&
                    <Route path="/login">
                      <Login />
                    </Route>}
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
