const router = require('express').Router();
const axios = require('axios');
const APIPATH = 'https://api.iextrading.com/1.0';
const iex = require('iexcloud_api_wrapper');
const { Transaction } = require('./db');

module.exports = router;

// router.get('/:stock', (req, res, next) => {
//   iex
//     .deepBook('ko')
//     .then(quote => res.json(quote))
//     .catch(next);

//   // axios
//   //   .get(`${APIPATH}/tops`)
//   //   .then(({ data }) => res.json(data))
//   //   .catch(next);
// });

router.get('/transactions/:id', (req, res, next) => {
  Transaction.findAll({
    where: { userId: req.params.id },
    order: [['createdAt', 'DESC']],
  })
    .then(transactions => res.json(transactions))
    .catch(next);
});

router.post('/prices', (req, res, next) => {
  const symbols = req.body.join(',');
  console.log('symbols in api route #######', symbols);
  axios
    .get(`https://api.iextrading.com/1.0/tops/last?symbols=${symbols}`)
    .then(({ data }) => res.send(data))
    .catch(next);
});
