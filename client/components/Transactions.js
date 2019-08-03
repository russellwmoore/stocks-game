import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLogOut, fetchTransactions, fetchPrices } from '../store';

class Transactions extends Component {
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

  render() {
    const { transactions, prices, user } = this.props;
    const priceMap = prices.reduce((accum, current) => {
      accum[current.symbol] = current.price;
      return accum;
    }, {});
    return (
      <>
        <h1>Transaction History</h1>
        <div>So much history right now, {user.firstName}!</div>

        <div>
          <table>
            <tbody>
              <tr>
                <td>Date</td>
                <td>Type</td>
                <td>Symbol</td>
                <td>Amount</td>
                <td>Price</td>
              </tr>
              {transactions.map(transaction => {
                const {
                  type,
                  symbol,
                  amount,
                  price,
                  id,
                  createdAt,
                } = transaction;
                return (
                  <tr key={id}>
                    <td>{new Date(createdAt).toUTCString()}</td>
                    <td>{type.toUpperCase()}</td>
                    <td>({symbol || 'Initial Balance'})</td>
                    <td>{amount || 'N/A'}</td>
                    <td>{Number.parseFloat(price).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
  )(Transactions)
);
