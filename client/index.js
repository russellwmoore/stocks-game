import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import Routes from './components/Routes';
import history from './history';
import './socket';
import './socketStocks';
import Navbar from './components/Nav';
import Footer from './components/Footer';

const appDiv = document.getElementById('app');

class App extends Component {
  componentDidMount() {
    //TODO: check this cookie here against the sessions. If the sessions table
    // has an associated user, then set that user ID to state
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div id="container">
            <Navbar />
            <Routes />
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, appDiv);
