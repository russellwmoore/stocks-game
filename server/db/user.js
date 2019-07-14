const db = require('./db');

const User = db.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('password');
    },
  },
});

module.exports = User;
