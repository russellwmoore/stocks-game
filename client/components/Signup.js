import React from 'react';
import { connect } from 'react-redux';
import { signupUser } from '../store';
import { withRouter, Link } from 'react-router-dom';

class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
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
    const { name, email, password } = this.state;
    return (
      <>
        <h1>Sign Up Now!</h1>
        <form onSubmit={this.handleSubmit} className="stock-form">
          <div>
            <label>Name</label>
            <input
              onChange={this.handleChange}
              value={name}
              type="text"
              name="name"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              onChange={this.handleChange}
              value={email}
              type="email"
              name="email"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              onChange={this.handleChange}
              value={password}
              type="password"
              name="password"
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <span className="red">{this.props.error.signUp}</span>
        <p>
          Have an account already? <Link to="/login">Log in</Link>
        </p>
      </>
    );
  }
}

const mapState = state => ({ user: state.user, error: state.error });

const mapDispatch = {
  signupUser,
};
export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Signup)
);
