import React from 'react';

import ApiUsers from './api/Users';
import Firebase from './api/Firebase';
import Gravatar from './api/Gravatar';
import Swapi from './api/Swapi';

// Getting a random number between 0 (inclusive) and max (exclusive)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class SignUp extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: '',
          username: '',
          error: '',
          submitting: false,
          suggesting: false
      };
  }

  onSubmit = async (e) => {
      const { email, password, username } = this.state;
      e.preventDefault();
      if ((email !== '') && (password !== '') && (username !== '')) {
          this.setState({ error: '', submitting: true });
          let exists = await ApiUsers.exists(username);
          console.log('exists:', exists);
          exists = true;
          if (exists) {
              this.setState({ error: 'Username not available', submitting: false });
          } else {
              Firebase.auth().createUserWithEmailAndPassword(email, password)
                  .then(this.onSuccess)
                  .catch(this.onError);
          }
      } else {
          this.setState({ error: 'Please specify email, username and password' });
      }
  }

  onSuccess = (e) => {
      const { email, username } = this.state;
      this.setState({ submitting: false });
      const profileURL = Gravatar.profileImageURL(email);
      ApiUsers.create(username, profileURL);
  }

  onError = (e) => {
      this.setState({ error: e.message || 'Signup error', submitting: false });
  }

  suggestUsername = async () => {
      this.setState({ error: '', suggesting: true });
      try {
          // We know Swapi returns at least 50 planets
          const randomPage = 1 + getRandomInt(5);
          const response = await Swapi.planets(randomPage);
          this.setState({ suggesting: false });
          const planets = response.data.results;
          // pick 2 random planets
          const idx1 = getRandomInt(planets.length);
          let idx2 = idx1;
          while (idx2 === idx1) {
              idx2 = getRandomInt(planets.length);
          }
          const name1 = planets[idx1].name;
          const name2 = planets[idx2].name;
          const username = name1 + ' ' + name2;
          this.setState({ username });
      } catch (e) {
          this.setState({ error: 'Swapi call failed' });
      }
  }

  changeEmail = (e) => {
      this.setState({ email: e.target.value });
  }

  changePassword = (e) => {
      this.setState({ password: e.target.value });
  }

  changeUsername = (e) => {
      const username = e.target.value;
      this.setState({ username });
  }

  render() {
      const { email, password, username, error, suggesting, submitting } = this.state;

      return (
        <section>
          <h1>Sign Up</h1>
          {error && <div className='error'>{error}</div>}
          <form method='post' onSubmit={this.onSubmit}>
              <div>
                  Email:
                  <input name='email' type='email'
                         value={email} onChange={this.changeEmail} />
              </div>
              <div>
                  Username:
                  <input name='username' type='username'
                         value={username} onChange={this.changeUsername} />
                  <button onClick={this.suggestUsername}
                          type='button' disabled={suggesting}>
                      { suggesting ? 'Suggesting...' : 'Suggest Username' }
                  </button>
              </div>
              <div>
                  Password:
                  <input name='password' type='password'
                         value={password} onChange={this.changePassword} />
              </div>
              <button type='submit' disabled={submitting}>
                  {submitting ? 'Signing up...' : 'Signup'}
              </button>
          </form>
        </section>
      );
  }
}

export default SignUp;
