import React from 'react';

import Firebase from './api/Firebase';

class SignUp extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: '',
          username: '',
          error: '',
          submitting: false
      };
  }

  onSubmit = (e) => {
      const { email, password, username } = this.state;
      e.preventDefault();
      if ((email !== '') && (password !== '') && (username !== '')) {
          this.setState({ error: '', submitting: true });
          // how do I add username to it?
          // or is this done in Users?
          // then how would i connect them?
          Firebase.auth().createUserWithEmailAndPassword(email, password)
              .then(this.onSuccess)
              .catch(this.onError)
      }
  }

  onSuccess = (e) => {
      this.setState({ submitting: false });
  }

  onError = (e) => {
      this.setState({ error: e.message || 'Signup error', submitting: false });
  }

  changeEmail = (e) => {
      this.setState({ email: e.target.value });
  }

  changePassword = (e) => {
      this.setState({ password: e.target.value });
  }

  changeUsername = (e) => {
      let users = Firebase.database().ref('users');
      users.child('username').equalTo(e.target.value).once("value", snapshot => {
          if ((snapshot.exists())) {
              // if it exists then don't want to add it and user should choose a different username
          }
      })
      
      this.setState({ username: e.target.value });
  }

  // do i check here if the username has been taken?

  render() {
      const { email, password, error, submitting } = this.state;

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
