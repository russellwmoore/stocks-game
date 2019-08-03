import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLogOut, fetchTransactions, fetchPrices } from '../store';

class Portfolio extends Component {
  constructor() {
    super();
    this.state = {
      currentPrices: [],
    };
  }

  componentDidMount() {
    this.props.fetchTransactions(this.props.user.id);
    // this.props.fetchPrices();
    // const symbols = this.props.transactions.map(t => t.symbol);
    // console.log(symbols, 'component symbols');
    // this.props.fetchPrices(symbols);
  }

  // calcTotal(stocks) {
  //   return stocks.reduce((accum, current) => {
  //     if(current.type === "init") {
  //       return accum +
  //     }else if(current.type === "buy") {

  //     }
  //   }, 0)
  // }
  render() {
    const { transactions, user, fetchLogOut, prices } = this.props;
    const priceMap = prices.reduce((accum, current) => {
      accum[current.symbol] = current.price;
      return accum;
    }, {});
    console.log('price map', priceMap);
    return (
      <>
        <h1>Stocks ++</h1>
        <h1>Hello {user.firstName}</h1>
        <div>So many stocks right now!</div>

        <div>
          {transactions.map(transaction => {
            if (transaction.type !== 'init') {
              return (
                <p key={transaction.id}>
                  Symbol:{transaction.symbol || 'none'}, Amount of stock:{' '}
                  {transaction.amount}, Buy price per share:{transaction.price},
                  Total: {transaction.amount * transaction.price}
                  Current Price: {priceMap[transaction.symbol]}
                  Current Value{' '}
                  {priceMap[transaction.symbol] * transaction.amount}
                </p>
              );
            }
          })}
        </div>
        <button onClick={fetchLogOut}>Log out</button>
      </>
    );
  }
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user,
    transactions: state.transactions,
    prices: state.prices,
  };
};

const mapDispatch = {
  fetchLogOut,
  fetchTransactions,
  fetchPrices,
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Portfolio)
);
