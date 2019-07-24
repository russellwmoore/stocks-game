import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// set user id on front end

const GET_ME = 'GET_ME';

const setMe = id => ({ type: GET_ME, id });

export const fetchMe = (email, password) => dispatch => {
  console.log(email, password);
  axios
    .post('/auth/login', { email, password })
    .then(({ data }) => {
      console.log('data', data);
      dispatch(setMe(data.id));
    })
    .catch(e => console.error(`can't set user`));
};

const initialState = {
  user: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ME:
      return { ...state, user: action.id };
    default:
      return state;
  }
};

export default createStore(reducer, applyMiddleware(thunk, logger));
