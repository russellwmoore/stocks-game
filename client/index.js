import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Login } from './components';
import { Provider } from 'react-redux';
import store from './store';

const appDiv = document.getElementById('app');

class Home extends Component {
  render() {
    return (
      <Provider store={store}>
        <h1>Stock App ++</h1>
        <Login />
      </Provider>
    );
  }
}

ReactDOM.render(<Home />, appDiv);
