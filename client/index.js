import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';

const appDiv = document.getElementById('app');

class Home extends Component {
  componentDidMount() {
    //TODO: check this cookie here against the sessions. If the sessions table
    // has an associated user, then set that user ID to state
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<Home />, appDiv);
