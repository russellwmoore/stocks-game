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
const ADD_TRANSACTION = 'ADD_TRANSACTION';
const SET_PRICES = 'SET_PRICES';
const ADD_PRICE = 'ADD_PRICE';
const UPDATE_PRICE = 'UPDATE_PRICE';
const SET_OPENING_PRICES = 'SET_OPENING_PRICES';
const SIGNUP_ERROR = 'SIGNUP_ERROR';
const PURCHASE_ERROR = 'PURCHASE_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';
const ERROR = 'ERROR';

const setMe = user => ({ type: GET_ME, user });
const signUp = user => ({ type: SIGNUP_USER, user });
const setTransactions = transactions => ({
  type: SET_TRANSACTIONS,
  transactions,
});
const setPrices = prices => ({ type: SET_PRICES, prices });
export const updatePrice = price => ({ type: UPDATE_PRICE, price });
const addPrice = price => ({ type: ADD_PRICE, price });
const logOut = () => ({ type: LOG_OUT });
const setOpeningPrices = prices => ({ type: SET_OPENING_PRICES, prices });
const addTransaction = transaction => ({ type: ADD_TRANSACTION, transaction });
const signupError = error => ({ type: SIGNUP_ERROR, error });
const clearError = () => ({ type: CLEAR_ERROR });
const purchaseError = error => ({ type: PURCHASE_ERROR, error });
const apiError = error => ({ type: ERROR, error });

export const fetchMe = (email, password) => dispatch => {
  // console.log(email, password);
  dispatch(clearError());
  axios
    .post('/auth/login', { email, password })
    .then(({ data }) => {
      console.log('data in login', data);
      dispatch(setMe(data));
      history.push('/portfolio');
    })
    .catch(e => {
      console.error(`can't set user`, e);
      dispatch(apiError(e.response.data));
    });
};

export const signupUser = user => dispatch => {
  dispatch(clearError());
  return axios
    .post('/auth/signup', user)
    .then(({ data }) => {
      console.log('data in signup', data);
      dispatch(setMe(data));
      history.push('/portfolio');
    })
    .catch(e => {
      console.error('Error with signup', e);
      dispatch(signupError(e.response.data));
    });
};

export const fetchLogOut = () => dispatch => {
  axios
    .post('/auth/logout')
    .then(({ data }) => {
      console.log(data);
      dispatch(logOut());
      history.push('/');
    })
    .catch(e => console.error('logout failed', e));
};

export const fetchTransactions = userId => async dispatch => {
  try {
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

    const openPrices = await axios.post('/api/open-prices', symbols);
    console.log('openPrices in thunk', openPrices.data);

    // const prices = await axios.post(`api/prices`, symbols);
    dispatch(setPrices(openPrices.data));
  } catch (e) {
    console.error('Problem Fetching Transactions', e);
  }
};

export const fetchAddTransaction = transaction => async dispatch => {
  dispatch(clearError());
  try {
    const { data: newTransaction } = await axios.post('/api/buy', transaction);

    console.log('type of newTransaction*****', newTransaction instanceof Error);
    dispatch(addTransaction(newTransaction)); // add transaction to state
    const { data: price } = await axios.post('/api/open-prices', [
      newTransaction.symbol,
    ]);
    dispatch(addPrice(price[0])); // add opening price to state, and current.
    currentStocksSocket.emit('subscribe', newTransaction.symbol); // subsribe socket to changes with this particular stock
  } catch (e) {
    console.error('problem in fetchAddTransaction thunk', e);
    dispatch(purchaseError(e.response.data));
  }
};

export const fetchSellTransaction = transaction => async dispatch => {
  console.log('we here', transaction);
  dispatch(clearError());
  try {
    const { data: newTransaction } = await axios.post('/api/sell', transaction);
    console.log('type of newTransaction*****', newTransaction);
    dispatch(addTransaction(newTransaction));
  } catch (e) {
    console.error('problem in fetchAddTransaction thunk', e);
  }
};

export const fetchPrices = symbols => async dispatch => {
  try {
    const { data } = axios.post(`api/prices`, symbols);
    dispatch(setPrices(data));
  } catch (e) {
    console.error('error fetching prices', e);
  }
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
  error: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ME:
      return { ...state, user: action.user };
    case LOG_OUT:
      return { ...state, user: {} };
    case SET_TRANSACTIONS:
      return { ...state, transactions: action.transactions };
    case ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, action.transaction],
      };
    case SET_PRICES:
      return { ...state, prices: action.prices };
    case ADD_PRICE:
      return { ...state, prices: [...state.prices, action.price] };
    case UPDATE_PRICE:
      return {
        ...state,
        prices: state.prices.map(price => {
          if (price.symbol === action.price.symbol) {
            return { ...price, price: action.price.price };
          } else return price;
        }),
      };
    case SIGNUP_ERROR:
      return {
        ...state,
        error: { signUp: action.error },
      };
    case PURCHASE_ERROR:
      return { ...state, error: { purchase: action.error } };
    case ERROR:
      return { ...state, error: { message: action.error } };
    case CLEAR_ERROR:
      return { ...state, error: '' };
    case SET_OPENING_PRICES:
    // action.prices = [
    // { symbol: 'F', openingPrice: 9.28 },
    // { symbol: 'FB', openingPrice: 189.02 },
    // { symbol: 'KO', openingPrice: 52.33 }
    // ]
    // state.prices = [{ symbol: "F", price: 9.15, size: 2500, time: 1565026986271, seq: 1153 }]

    // go through state.prices
    // if you see
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunk, logger));
export default store;
