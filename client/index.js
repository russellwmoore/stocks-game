import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Login } from './components';

const appDiv = document.getElementById('app');

class Home extends Component {
  render() {
    return (
      <>
        <h1>Stock App ++</h1>
        <Login />
      </>
    );
  }
}

ReactDOM.render(<Home />, appDiv);
