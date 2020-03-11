import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLogOut, fetchTransactions, fetchPrices } from '../store';
import { makePriceMap, makePortfolioValue } from '../utils';

class Transactions extends Component {
  constructor() {
    super();
    this.state = {
      currentPrices: [],
    };
  }

  componentDidMount() {
    this.props.fetchTransactions(this.props.user.id);
  }

  render() {
    const { transactions, prices, user, fetchLogOut } = this.props;
    const priceMap = makePriceMap(prices);

    const portfolioValue = makePortfolioValue(transactions, priceMap);

    return (
      <>
        <h1>Stocks ++</h1>
        <h1>Transaction History</h1>
        <div>So much history right now, {user.name}!</div>
        <div>
          Total current value: ${Number.parseFloat(portfolioValue).toFixed(3)}!
        </div>

        <div id="transaction-container">
          <table>
            <tbody>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Symbol</th>
                <th>Amount</th>
                <th>Price at Purchase</th>
                <th>Current Price</th>
              </tr>
              {transactions
                .filter(t => t.symbol)
                .map(transaction => {
                  const {
                    type,
                    symbol,
                    amount,
                    price,
                    id,
                    createdAt,
                  } = transaction;
                  const initDate = new Date(createdAt);
                  const date = initDate.toLocaleString();
                  return (
                    <tr key={id}>
                      <td>{date}</td>
                      <td>{type.toUpperCase()}</td>
                      <td className="center">{symbol}</td>
                      <td className="right">{amount}</td>
                      <td className="right">
                        {`$${Number.parseFloat(price).toFixed(2)}`}
                      </td>
                      <td className="right">{priceMap[symbol]}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <button
            className="big-btn"
            onClick={fetchLogOut}
          >{`Log out ${user.name}`}</button>
        </div>
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

export default withRouter(connect(mapState, mapDispatch)(Transactions));
