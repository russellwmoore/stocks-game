import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const appDiv = document.getElementById('app');

class HomePage extends Component {
  render() {
    return <h1>hello react</h1>;
  }
}

ReactDOM.render(<HomePage />, appDiv);
