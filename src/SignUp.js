import React from 'react';

import Firebase from './firebase';

class SignUp extends React.Component {

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
                  Password:
                  <input name='password' type='password'
                         value={password} onChange={this.changePassword} />
              </div>
              <button type='submit' disabled={submitting}>Signup</button>
          </form>
        </section>
      );
  }
}

export default SignUp;
