const Transaction = require('./transaction');
const User = require('./user');
const Session = require('./session');
const Stock = require('./stock');
const db = require('./db');

User.hasMany(Transaction);
Transaction.belongsTo(User);

Transaction.belongsTo(Stock, { foreignKey: 'symbol', targetKey: 'symbol' });

User.hasMany(Session);
Session.belongsTo(User);

module.exports = { db, User, Transaction, Session, Stock };
