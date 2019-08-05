import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Purchase extends Component {
  constructor() {
    super();
    this.state = {
      symbol: '',
      amount: 1,
      error: '',
    };
  }

  handleAmountChange = e => {
    if (this.validateNum(e.target.value)) {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  handleSymbolChange = e => {
    this.setState({
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  validateNum = num => {
    if (num < 1) return false;
    if (!Number.isInteger(Number(num))) return false;
    return true;
  };

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post('/api/buy', {
        symbol: this.state.symbol,
        amount: this.state.amount,
      })
      .then(({ data }) => console.log(data))
      .catch(e => console.log(e.message));
  };

  render() {
    const { transactions } = this.props;
    let totalCash = transactions.reduce((accum, curr) => {
      if (curr.type === 'init') {
        return accum + Number(curr.price);
      } else if (curr.type === 'buy') {
        return accum - curr.price * curr.amount;
      }
    }, 0);
    totalCash = Number.parseFloat(totalCash).toFixed(2);

    return (
      <div id="purchase">
        {`Total Cash : ${totalCash}`}
        {this.state.errorMessage}
        <form
          onSubmit={this.handleSubmit}
          className="stock-form"
          id="purchase-form"
        >
          <div>
            <label>Symbol</label>
            <input
              onChange={this.handleSymbolChange}
              name="symbol"
              type="text"
              value={this.state.symbol}
            />
          </div>
          <div>
            <label>Amount</label>
            <input
              onChange={this.handleAmountChange}
              name="amount"
              type="number"
              value={this.state.amount}
            />
          </div>
          <button type="submit">Buy</button>
        </form>
      </div>
    );
  }
}

const mapState = state => {
  return {
    transactions: state.transactions,
  };
};

export default connect(mapState)(Purchase);
