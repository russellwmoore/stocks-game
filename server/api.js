const router = require('express').Router();
const axios = require('axios');
const APIPATH = 'https://api.iextrading.com/1.0';
const iex = require('iexcloud_api_wrapper');

module.exports = router;

router.get('/:stock', (req, res, next) => {
  iex
    .deepBook('ko')
    .then(quote => res.json(quote))
    .catch(next);

  // axios
  //   .get(`${APIPATH}/tops`)
  //   .then(({ data }) => res.json(data))
  //   .catch(next);
});
