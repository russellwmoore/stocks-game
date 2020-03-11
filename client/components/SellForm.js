import React from 'react';

class SellForm extends React.Component {
  constructor() {
    super();
    this.state = {
      amount: 1,
    };
  }
  render() {
    return (
      <form>
        <input type="number" />
        <button type="submit">sell</button>
      </form>
    );
  }
}
