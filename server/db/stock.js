const db = require('./db');
const Sequelize = require('sequelize');

const Stock = db.define('stock', {
  symbol: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: false,
    },
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  isEnabled: {
    type: Sequelize.BOOLEAN,
  },
  iexId: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Stock;
