import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './Login';
import Signup from './Signup';
import Transactions from './Transactions';
import { me } from '../store';
import MainView from './MainView';

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitData();
  }

  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        {this.props.isLoggedIn && (
          <Switch>
            <Route path="/transactions" component={Transactions} />
            <Route path="/portfolio" component={MainView} />
            <Route path="/" component={MainView} />
          </Switch>
        )}
        <Route path="/" component={Login} />
      </Switch>
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
