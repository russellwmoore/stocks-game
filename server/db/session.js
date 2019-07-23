const db = require('./db');
const Sequelize = require('sequelize');

const Session = db.define('session', {
  sessionId: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Session;
