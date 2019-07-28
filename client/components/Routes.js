import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './Login';
import Home from './Home';
import { me } from '../store';

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitData();
  }

  render() {
    return (
      <>{this.props.isLoggedIn ? <Home /> : <Login />}</>
      // <Switch>
      //   <Route path="/login" component={Login} />
      //   {this.props.isLoggedIn && <Route path="/home" component={Home} />}
      // </Switch>
    );
  }
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
  };
};

const mapDispatch = dispatch => {
  return {
    loadInitData() {
      console.log('here');
      dispatch(me());
    },
  };
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Routes)
);
