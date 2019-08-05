import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchLogOut,
  fetchTransactions,
  fetchPrices,
  updatePrice,
} from '../store';
import { currentStocksSocket, socketsForComponent } from '../socketStocks';
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
    currentStocksSocket.on('connect', () => {
      console.log('stockets working');
      currentStocksSocket.on('message', message => {
        this.props.updatePrice(JSON.parse(message));
      });
    });
    currentStocksSocket.on('disconnect', () => console.log('Disconnected.'));
  }

  componentWillUnmount() {}

  // TODO: move big functions away and import
  render() {
    const { transactions, fetchLogOut, prices } = this.props;

    const priceMap = prices.reduce((accum, current) => {
      accum[current.symbol] = current.price;
      return accum;
    }, {});

    const openingPriceMap = prices.reduce((accum, current) => {
      accum[current.symbol] = current.openingPrice;
      return accum;
    }, {});

    const totalCash = transactions.reduce((accum, curr) => {
      if (curr.type === 'init') {
        return accum + Number(curr.price);
      } else if (curr.type === 'buy') {
        return accum - curr.price * curr.amount;
      }
    }, 0);

    const portfolioValue = transactions.reduce((accum, curr) => {
      if (curr.type === 'init') return accum;
      return accum + curr.amount * priceMap[curr.symbol];
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
        accum.push({
          symbol: curr.symbol,
          amount: curr.amount,
          openingPrice: openingPriceMap[curr.symbol],
        });
      } else {
        accum[match].amount += curr.amount;
      }
      return accum;
    }, []);

    return (
      <div id="portfolio">
        <div>{`Portfolio Value: $${Number.parseFloat(portfolioValue).toFixed(
          3
        )}`}</div>
        <div id="portfolio-container">
          <div className="stock-container">
            <div className="symbol">Symbol</div>
            <div className="shares">Shares</div>
            <div className="price">Current Price</div>
            <div className="value">Total Value</div>
          </div>
          {combined.map(transaction => {
            const color =
              transaction.openingPrice > priceMap[transaction.symbol]
                ? 'red'
                : 'green';
            console.log(
              `${transaction.symbol}: ${transaction.openingPrice}, ${
                priceMap[transaction.symbol]
              }, `
            );

            return (
              <div
                key={transaction.id}
                className={`stock-container ${color || `gray`}`}
              >
                <div className="symbol">{transaction.symbol}</div>
                <div className="shares">{transaction.amount}</div>
                <div className="price">${priceMap[transaction.symbol]}</div>
                <div className="value">
                  $
                  {Number.parseFloat(
                    priceMap[transaction.symbol] * transaction.amount
                  ).toFixed(3)}
                </div>
              </div>
            );
          })}
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
  updatePrice,
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Portfolio)
);
