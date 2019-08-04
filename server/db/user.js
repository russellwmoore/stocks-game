const db = require('./db');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const Transaction = require('./transaction');

const User = db.define('user', {
  name: {
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
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('salt');
    },
  },
  password: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('password');
    },
  },
});

User.prototype.getCash = async function() {
  const allBuyTransactions = await Transaction.findAll({
    where: {
      userId: this.id,
    },
  });

  const cash = allBuyTransactions.reduce((accum, curr) => {
    if (curr.type === 'init') {
      return accum + Number(curr.price);
    }
    if (curr.type === 'buy') {
      return accum - curr.amount * curr.price;
    }
    if (curr.type === 'sell') {
      return accum + Number(curr.amount * curr.price);
    }
  }, 0);
  return cash;
};

User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password();
};

User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex');
};

// Hooks
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

const addInitialTransaction = user => {
  Transaction.create({
    price: 5000,
    symbol: null,
    type: 'init',
    userId: user.id,
  });
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.afterCreate(addInitialTransaction);

module.exports = User;
