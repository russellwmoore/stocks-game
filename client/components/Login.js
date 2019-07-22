import React from 'react';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { firstName, lastName, email, password } = this.state;
    return (
      <>
        <h1>Log in Now!</h1>
        <form>
          <label>First Name</label>
          <input
            onChange={this.handleChange}
            value={firstName}
            type="text"
            name="firstName"
          />
          <label>Last Name</label>
          <input
            onChange={this.handleChange}
            value={lastName}
            type="text"
            name="lastName"
          />
          <label>Email</label>
          <input
            onChange={this.handleChange}
            value={email}
            type="text"
            name="email"
          />
          <label>Password</label>
          <input
            onChange={this.handleChange}
            value={password}
            type="password"
            name="password"
          />
          <button type="submit">Log In</button>
        </form>
      </>
    );
  }
}

export default Login;
