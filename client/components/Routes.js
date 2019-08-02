import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import { me } from '../store';

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitData();
  }

  render() {
    console.log('in routes comoponent', this.props);
    return (
      <>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          {this.props.isLoggedIn && (
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/" component={Home} />
            </Switch>
          )}
          <Route component={Login} />
        </Switch>
      </>
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
