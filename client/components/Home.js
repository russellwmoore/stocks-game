import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Home extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <>
        <h1>hellllo home</h1>
        <h1>Hello {this.props.user.firstName}</h1>
        <button>Log out</button>
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

export default withRouter(connect(mapState)(Home));
