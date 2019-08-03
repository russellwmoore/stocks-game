import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './Login';
import Portfolio from './Portfolio';
import Signup from './Signup';
import Transactions from './Transactions';
import Nav from './Nav';
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
            <>
              <Nav />
              <Switch>
                <Route path="/portfolio" component={Portfolio} />
                <Route path="/transactions" component={Transactions} />
                <Route path="/" component={Portfolio} />
              </Switch>
            </>
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
