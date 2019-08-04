import React, { Component } from 'react';
import Portfolio from './Portfolio';
import Purchase from './Purchase';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class MainView extends Component {
  render() {
    return (
      <>
        <h1>Stocks ++</h1>
        <h1>{`Hello ${this.props.user.name}`}</h1>
        <div id="main-view">
          <Portfolio />
          <Purchase />
        </div>
      </>
    );
  }
}

const mapState = state => {
  return {
    user: state.user,
    prices: state.prices,
  };
};

export default withRouter(connect(mapState)(MainView));
