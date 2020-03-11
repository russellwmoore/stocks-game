import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchLogOut,
  fetchTransactions,
  fetchPrices,
  updatePrice,
  fetchSellTransaction,
} from '../store';
import {
  makePriceMap,
  makeOpeningPriceMap,
  makePortfolioValue,
  makePortfolioLineItems,
  nanChecker,
} from '../utils';
import { currentStocksSocket, socketsForComponent } from '../socketStocks';

class Portfolio extends Component {
  constructor() {
    super();
    this.state = {
      currentPrices: [],
    };
    this.handleSell = this.handleSell.bind(this);
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

  handleSell(e, transaction, priceMap) {
    e.preventDefault();
    const amount = e.target.previousSibling.value;
    this.props.fetchSellTransaction({
      price: priceMap[transaction.symbol],
      symbol: transaction.symbol,
      type: 'sell',
      amount,
    });
  }

  render() {
    const {
      transactions,
      fetchLogOut,
      prices,
      user,
      priceMap,
      portfolioLineItems,
      openingPriceMap,
    } = this.props;

    console.log('this.props', this.props);

    const portfolioValue = makePortfolioValue(transactions, priceMap);

    const whichColor = (transaction, openingPriceMap) => {
      if (openingPriceMap[transaction.symbol] > priceMap[transaction.symbol]) {
        return 'red';
      } else if (
        openingPriceMap[transaction.symbol] < priceMap[transaction.symbol]
      ) {
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
            <div className="price">Current</div>
            <div className="open-price">Open</div>
            <div className="value">Total Value</div>
          </div>
          {portfolioLineItems.map(transaction => {
            const color = whichColor(transaction, this.props.openingPriceMap);
            return (
              <div
                key={transaction.symbol}
                className={`stock-container ${color}`}
              >
                <div className="symbol">{transaction.symbol}</div>
                <div className="shares">{transaction.amount}</div>
                <div className="price">
                  ${Number.parseFloat(priceMap[transaction.symbol]).toFixed(3)}
                </div>
                <div className="open-price">
                  {openingPriceMap[transaction.symbol]}
                </div>
                <div className="value">
                  $
                  {Number.parseFloat(
                    priceMap[transaction.symbol] * transaction.amount
                  ).toFixed(3)}
                </div>
                <div>
                  <input
                    className="sell-input"
                    type="number"
                    min="1"
                    defaultValue="1"
                    max={transaction.amount}
                  />
                  <button
                    onClick={e => this.handleSell(e, transaction, priceMap)}
                    type="submit"
                    className="sell-btn"
                  >
                    Sell
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="big-btn"
          onClick={fetchLogOut}
        >{`Log out ${user.name}`}</button>
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
    priceMap: makePriceMap(state.prices),
    openingPriceMap: makeOpeningPriceMap(state.prices),
    portfolioLineItems: makePortfolioLineItems(state.transactions),
  };
};

const mapDispatch = {
  fetchLogOut,
  fetchTransactions,
  fetchPrices,
  updatePrice,
  fetchSellTransaction,
};

export default withRouter(connect(mapState, mapDispatch)(Portfolio));
