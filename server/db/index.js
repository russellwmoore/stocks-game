const Transaction = require('./transactions');
const User = require('./user');
const db = require('./db');

User.hasMany(Transaction);
Transaction.belongsTo(User);

module.exports = { db, User, Transaction };
