import React, { Component } from 'react';
import axios from 'axios';

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
    return (
      <div>
        {this.state.errorMessage}
        <form onSubmit={this.handleSubmit}>
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

export default Purchase;
