import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchLogOut,
  fetchTransactions,
  fetchPrices,
  updatePrice,
} from '../store';
import {
  makePriceMap,
  makeOpeningPriceMap,
  makePortfolioValue,
  makePortFolioLineItems,
} from '../utils';
import { currentStocksSocket, socketsForComponent } from '../socketStocks';

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
        console.log('soccket update', message);
        this.props.updatePrice(JSON.parse(message));
      });
    });
    currentStocksSocket.on('disconnect', () => console.log('Disconnected.'));
  }

  render() {
    const { transactions, fetchLogOut, prices, user } = this.props;

    const priceMap = makePriceMap(prices);
    const openingPriceMap = makeOpeningPriceMap(prices);
    const portfolioValue = makePortfolioValue(transactions, priceMap);
    const portFolioLineItems = makePortFolioLineItems(
      transactions,
      openingPriceMap
    );

    const whichColor = transaction => {
      if (transaction.openingPrice > priceMap[transaction.symbol]) {
        return 'red';
      } else if (transaction.openingPrice < priceMap[transaction.symbol]) {
        return 'green';
      } else return 'gray';
    };

    return (
      <div id="portfolio">
        <div>{`Portfolio Value: $${Number.parseFloat(portfolioValue).toFixed(
          3
        )}`}</div>
        <div id="portfolio-container">
          <div className="stock-container" id="legend">
            <div className="symbol">Symbol</div>
            <div className="shares">Shares</div>
            <div className="price">Current Price</div>
            <div className="value">Total Value</div>
          </div>
          {portFolioLineItems.map(transaction => {
            const color = whichColor(transaction);
            return (
              <div key={transaction.id} className={`stock-container ${color}`}>
                <div className="symbol">{transaction.symbol}</div>
                <div className="shares">{transaction.amount}</div>
                <div className="price">
                  ${Number.parseFloat(priceMap[transaction.symbol]).toFixed(3)}
                </div>
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
        <button onClick={fetchLogOut}>{`Log out ${user.name}`}</button>
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
