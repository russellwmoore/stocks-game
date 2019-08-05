import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { me } from '../store';

class Navbar extends React.Component {
  componentDidMount() {
    this.props.loadInitData();
  }

  render() {
    return (
      this.props.isLoggedIn && (
        <div id="nav-buttons">
          <NavLink
            to="/portfolio"
            className="nav-button"
            activeClassName="selected"
          >
            Portfolio
          </NavLink>
          <NavLink
            to="/transactions"
            className="nav-button"
            activeClassName="selected"
          >
            Transactions
          </NavLink>
        </div>
      )
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
  )(Navbar)
);
