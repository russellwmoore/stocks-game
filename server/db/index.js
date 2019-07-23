const Transaction = require('./transaction');
const User = require('./user');
const Session = require('./session');
const db = require('./db');

User.hasMany(Transaction);
Transaction.belongsTo(User);

User.hasMany(Session);
Session.belongsTo(User);

module.exports = { db, User, Transaction, Session };
