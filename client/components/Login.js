import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchMe } from '../store';

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

  handleSubmit = e => {
    e.preventDefault();
    // send credentials to login route
    // axios.post('/auth/login', this.state).then(({ data }) => {
    //   console.log(data);
    // });
    this.props.fetchMe(this.state.email, this.state.password);

    // if the log in is a success, then we can redirect to a different page
    // if the log in is not successful, re-reoute to bad page or just change view in some way
  };

  render() {
    const { firstName, lastName, email, password } = this.state;
    return (
      <>
        <h1>Log in Now!</h1>
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
  fetchMe,
};
export default connect(
  mapState,
  mapDispatch
)(Login);
