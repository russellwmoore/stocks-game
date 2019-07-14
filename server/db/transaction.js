const db = require('./db');
const Sequelize = require('sequelize');

const Transaction = db.define('transaction', {
  price: {
    type: Sequelize.DECIMAL,
  },
  symbol: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.ENUM('buy', 'sell'),
  },
});

module.exports = Transaction;
