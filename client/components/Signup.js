import React from 'react';
import { connect } from 'react-redux';
import { signupUser } from '../store';
import { withRouter } from 'react-router-dom';

class Signup extends React.Component {
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.signupUser(this.state);
  };

  render() {
    const { firstName, lastName, email, password } = this.state;
    return (
      <>
        <h1>Sign Up Now!</h1>
        <form onSubmit={this.handleSubmit}>
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

const mapState = state => ({ user: state.user });

const mapDispatch = {
  signupUser,
};
export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Signup)
);
