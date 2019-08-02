import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLogOut } from '../store';

class Home extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <>
        <h1>hellllo home</h1>
        <h1>Hello {this.props.user.firstName}</h1>
        <div>So many stocks right now!</div>
        <button onClick={this.props.fetchLogOut}>Log out</button>
      </>
    );
  }
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user,
  };
};

const mapDispatch = {
  fetchLogOut,
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Home)
);
