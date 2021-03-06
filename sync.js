const { db, User, Stock, Transaction } = require('./server/db');

const stocks = require('./scratch');

const sync = async () => {
  await db.sync({ force: true });
  await Promise.all([
    User.create({
      name: 'Russell',
      email: 'r@r.com',
      password: 'pw',
    }),
    User.create({
      name: 'Dan',
      email: 'd@d.com',
      password: 'pw',
    }),
  ]);
  console.log('users seeded');
  const stockPromises = stocks.map(stock => {
    return Stock.create(stock);
  });

  await Promise.all(stockPromises);
  console.log('symbols seeded');
  await Promise.all([
    Transaction.create({
      price: 50,
      symbol: 'KO',
      type: 'buy',
      userId: 1,
      amount: 20,
    }),
    Transaction.create({
      price: 52,
      symbol: 'KO',
      type: 'buy',
      userId: 1,
      amount: 15,
    }),
    Transaction.create({
      price: 187.59,
      symbol: 'FB',
      type: 'buy',
      userId: 1,
      amount: 10,
    }),
    Transaction.create({
      price: 10.4,
      symbol: 'F',
      type: 'buy',
      userId: 1,
      amount: 120,
    }),
    Transaction.create({
      price: 1200,
      symbol: 'GOOGL',
      type: 'buy',
      userId: 2,
      amount: 2,
    }),
    Transaction.create({
      price: 270,
      symbol: 'COST',
      type: 'buy',
      userId: 2,
      amount: 3,
    }),
    Transaction.create({
      price: 50,
      symbol: 'INTC',
      type: 'buy',
      userId: 2,
      amount: 3,
    }),
  ]);
  console.log('transactions seeded');
  await db.close();
  console.log('all done!');
};

sync();
