import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLogOut, fetchTransactions, fetchPrices } from '../store';
import { socket } from '../socketStocks';
import Purchase from './Purchase';

class Portfolio extends Component {
  constructor() {
    super();
    this.state = {
      currentPrices: [],
    };
  }

  componentDidMount() {
    this.props.fetchTransactions(this.props.user.id);
  }

  // TODO: move big functions away and import
  render() {
    const { transactions, user, fetchLogOut, prices } = this.props;
    const priceMap = prices.reduce((accum, current) => {
      accum[current.symbol] = current.price;
      return accum;
    }, {});
    const totalCash = transactions.reduce((accum, curr) => {
      if (curr.type === 'init') {
        return accum + Number(curr.price);
      } else if (curr.type === 'buy') {
        return accum - curr.price * curr.amount;
      }
    }, 0);

    const combined = transactions.reduce((accum, curr) => {
      if (curr.type === 'init') return accum;
      let match = -1;
      for (let i = 0; i < accum.length; i++) {
        if (accum[i].symbol === curr.symbol) {
          match = i;
          break;
        }
      }
      if (match === -1) {
        accum.push({ symbol: curr.symbol, amount: curr.amount });
      } else {
        accum[match].amount += curr.amount;
      }
      return accum;
    }, []);

    return (
      <div id="portfolio">
        <div>{`Cash: ${Number.parseFloat(totalCash).toFixed(2)}`}</div>
        <div id="portfolio-container">
          {combined.map(transaction => (
            <div key={transaction.id} className="stock-container">
              <div>
                {transaction.symbol} - {transaction.amount} shares
              </div>
              <div>
                Current Price: {priceMap[transaction.symbol]}
                Total Value: $
                {Number.parseFloat(
                  priceMap[transaction.symbol] * transaction.amount
                ).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <button onClick={fetchLogOut}>Log out</button>
      </div>
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
