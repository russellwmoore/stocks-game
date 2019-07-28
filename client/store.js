import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import history from './history';

// set user id on front end

const GET_ME = 'GET_ME';
const LOG_OUT = 'LOG_OUT';

const setMe = user => ({ type: GET_ME, user });
const logOut = () => ({ type: LOG_OUT });

export const fetchMe = (email, password) => dispatch => {
  console.log(email, password);
  axios
    .post('/auth/login', { email, password })
    .then(({ data }) => {
      console.log('data', data);
      dispatch(setMe(data));
      history.push('home');
    })
    .catch(e => console.error(`can't set user`));
};

export const fetchLogOut = () => dispatch => {
  axios.post('/auth/logout').then(({ data }) => {
    console.log(data);
    dispatch(logOut());
  });
};

export const me = () => dispatch => {
  axios
    .get('/auth/me')
    .then(({ data }) => {
      dispatch(setMe(data || {}));
    })
    .catch(err => {
      console.error(err);
    });
};

const initialState = {
  user: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ME:
      console.log(action.user);
      return { ...state, user: action.user };
    case LOG_OUT:
      return { ...state, user: {} };
    default:
      return state;
  }
};

export default createStore(reducer, applyMiddleware(thunk, logger));
