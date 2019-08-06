const router = require('express').Router();
const axios = require('axios');
const APIPATH = 'https://api.iextrading.com/1.0';
const { Transaction, User } = require('./db');
const iex = require('iexcloud_api_wrapper');

module.exports = router;

router.get('/transactions/:id', (req, res, next) => {
  Transaction.findAll({
    where: { userId: req.params.id },
    order: [['createdAt', 'ASC']],
  })
    .then(transactions => res.json(transactions))
    .catch(next);
});

//TODO: Should I subscribe to a socket here???
// what happens next? Listen for messages in component, and dispatch a price change?

router.post('/prices', (req, res, next) => {
  const symbols = req.body.join(',');
  console.log('symbols in api route #######', symbols);
  axios
    .get(`${APIPATH}/tops/last?symbols=${symbols}`)
    .then(({ data }) => {
      return res.send(data);
    })
    .catch(next);
});

router.post('/buy', async (req, res, next) => {
  // check to make sure the symbol is valid
  // check to make sure this user has enough money for the purchase
  // When need the up to date info for this stock.
  const { symbol, amount } = req.body;
  // TODO: move this magic string to constants folder
  try {
    const { data } = await axios.get(`${APIPATH}/tops/last?symbols=${symbol}`);
    if (data.length === 0) {
      return res.json(`no current price for this ${symbol}`);
    }

    const user = await User.findByPk(req.user.id);
    const cash = await user.getCash();
    const { price } = data[0];

    if (price * amount > cash) {
      const error = new Error('Not enough money');
      error.messageStatus = `Not enough money to by ${amount} shares of ${symbol}`;
      return next(error);
    }
    // [
    //   {
    //     "symbol": "SNAP",
    //     "price": 17.03,
    //     "size": 1,
    //     "time": 1564775999556
    //   }
    // ]
    // if they do, make a transaction for this user using the symbol, current price and amount of stock
    const newTransaction = await Transaction.create({
      price,
      symbol: req.body.symbol,
      type: 'buy',
      amount: req.body.amount,
      userId: req.user.id,
    });
    return res.json(newTransaction);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// wow, can't promise.all on this api wrapper!.
router.post('/open-prices', async (req, res, next) => {
  const symbols = req.body;
  try {
    const info = [];
    for (let i = 0; i < symbols.length; i++) {
      const quoteData = await iex.quote(symbols[i]);
      info.push({
        symbol: quoteData.symbol,
        price: quoteData.latestPrice,
        size: quoteData.iexRealtimeSize,
        openingPrice: quoteData.previousClose,
        time: quoteData.lastTradeTime,
      });
    }

    res.send(info);
  } catch (error) {
    next(error);
  }
});
