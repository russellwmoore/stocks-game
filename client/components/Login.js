import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchMe } from '../store';
import { Link, withRouter } from 'react-router-dom';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
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
    const { email, password } = this.state;
    return (
      <>
        <h1>Stocks ++</h1>
        <h1>Log in Now!</h1>
        <p1>
          Stocks ++ is a market simulation tool. You are given $5,000 to buy and
          sell until your heart is content. Good luck!
        </p1>
        <form onSubmit={this.handleSubmit} className="stock-form">
          <div>
            <label>Email</label>
            <input
              onChange={this.handleChange}
              value={email}
              type="text"
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
          <button type="submit">Log In</button>
        </form>
        <span>{this.props.error.message}</span>
        <p>
          No Account? <Link to="/signup">Sign up now</Link>.
        </p>
      </>
    );
  }
}

const mapState = state => ({ user: state.user, error: state.error });

const mapDispatch = {
  fetchMe,
};
export default withRouter(connect(mapState, mapDispatch)(Login));
