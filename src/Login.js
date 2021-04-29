import React from 'react';

import ApiUsers from './api/Users';
import Gravatar from './api/Gravatar';
import Firebase from './api/Firebase';

class Login extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: '',
          error: '',
          submitting: false
      };
  }

  onSubmit = (e) => {
      const { email, password } = this.state;
      e.preventDefault();
      if ((email !== '') && (password !== '')) {
          this.setState({ error: '', submitting: true });
          Firebase.auth().signInWithEmailAndPassword(email, password)
              .then(this.onSuccess)
              .catch(this.onError)
      }
  }

  onSuccess = (e) => {
      const { email } = this.state;
      this.setState({ submitting: false });
      const profileURL = Gravatar.profileImageURL(email);
      const username = email.split('@')[0];
      ApiUsers.create(username, profileURL);
  }

  onError = (e) => {
      this.setState({ error: 'Invalid credentials', submitting: false });
  }

  changeEmail = (e) => {
      this.setState({ email: e.target.value });
  }

  changePassword = (e) => {
      this.setState({ password: e.target.value });
  }

  render() {
      const { email, password, error, submitting } = this.state;

      return (
        <section>
          <h1>Login</h1>
          {error && <div className='error'>{error}</div>}
          <form method='post' onSubmit={this.onSubmit}>
              <div>
                  Email:
                  <input name='email' type='email'
                         value={email} onChange={this.changeEmail} />
              </div>
              <div>
                  Password:
                  <input name='password' type='password'
                         value={password} onChange={this.changePassword} />
              </div>
              <button type='submit' disabled={submitting}>
                  {submitting ? 'Logging in...' : 'Login'}
              </button>
          </form>
        </section>
      );
  }
}

export default Login;
