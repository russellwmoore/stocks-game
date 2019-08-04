import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import history from './history';
import { currentStocksSocket } from './socketStocks';

// set user id on front end

const GET_ME = 'GET_ME';
const LOG_OUT = 'LOG_OUT';
const SIGNUP_USER = 'SIGNUP_USER';
const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
const SET_PRICES = 'SET_PRICES';

const setMe = user => ({ type: GET_ME, user });
const signUp = user => ({ type: SIGNUP_USER, user });
const setTransactions = transactions => ({
  type: SET_TRANSACTIONS,
  transactions,
});
const setPrices = prices => ({ type: SET_PRICES, prices });

const logOut = () => ({ type: LOG_OUT });

export const fetchMe = (email, password) => dispatch => {
  console.log(email, password);
  axios
    .post('/auth/login', { email, password })
    .then(({ data }) => {
      console.log('data in login', data);
      dispatch(setMe(data));
      history.push('/portfolio');
    })
    .catch(e => console.error(`can't set user`));
  // TODO: dispatch errors to front end
};

export const signupUser = user => dispatch => {
  return axios
    .post('/auth/signup', user)
    .then(({ data }) => {
      console.log('data in signup', data);
      dispatch(setMe(data));
      history.push('/portfolio');
    })
    .catch(e => console.error(e));
};

export const fetchLogOut = () => dispatch => {
  axios.post('/auth/logout').then(({ data }) => {
    console.log(data);
    dispatch(logOut());
    history.push('/');
  });
};

export const fetchTransactions = userId => async dispatch => {
  const transactions = await axios.get(`/api/transactions/${userId}`);
  dispatch(setTransactions(transactions.data));
  const symbols = transactions.data
    .map(t => t.symbol)
    .filter((symbol, idx, self) => {
      if (symbol) {
        return self.indexOf(symbol) === idx;
      }
    });
  currentStocksSocket.emit('subscribe', symbols.join(','));

  const prices = await axios.post(`api/prices`, symbols);
  dispatch(setPrices(prices.data));
};

export const fetchPrices = symbols => async dispatch => {
  const { data } = axios.post(`api/prices`, symbols);
  dispatch(setPrices(data));
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
  transactions: [],
  prices: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ME:
      return { ...state, user: action.user };
    case LOG_OUT:
      return { ...state, user: {} };
    case SET_TRANSACTIONS:
      return { ...state, transactions: action.transactions };
    case SET_PRICES:
      return { ...state, prices: action.prices };

    default:
      return state;
  }
};

export default createStore(reducer, applyMiddleware(thunk, logger));
