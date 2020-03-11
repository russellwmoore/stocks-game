// TODO: generalize these two functions to be one function

/**
 *  takes:
 * [{symbol: "KO", price: 52.595, size: 100, openingPrice: 53.66, time: 1583935831958},
    {symbol: "FB", price: 173.875, size: 100, openingPrice: 178.19, time: 1583935862800},
    {symbol: "F", price: 6.09, size: 200, openingPrice: 6.26, time: 1583935857312}]
 *
 *  returns:
 *  {"KO": 52.595, "FB": 173.875, "F": 6.09}
 */
export const makePriceMap = prices => {
  return prices.reduce((accum, current) => {
    accum[current.symbol] = current.price;
    return accum;
  }, {});
};

/**
 *  takes:
 * [{symbol: "KO", price: 52.595, size: 100, openingPrice: 53.66, time: 1583935831958},
    {symbol: "FB", price: 173.875, size: 100, openingPrice: 178.19, time: 1583935862800},
    {symbol: "F", price: 6.09, size: 200, openingPrice: 6.26, time: 1583935857312}]
 *
 *  returns:
 *  {"KO": 53.66, "FB": 178.19, "F": 6.26}
 */
export const makeOpeningPriceMap = prices => {
  return prices.reduce((accum, current) => {
    accum[current.symbol] = current.openingPrice;
    return accum;
  }, {});
};

/**
 *
 * @param {Object []} transactions - Array of transactions
 * @param {string} transactions[].type - buy, sell or init
 * @param {Object {}} priceMap - an object of current prices created by makePriceMap
 * @returns {number} - total current value of portfolio
 */
export const makePortfolioValue = (transactions, priceMap) => {
  let symbolsAndAmounts = transactions.reduce((accum, curr) => {
    if (curr.type === 'init') return accum;
    if (curr.type === 'buy') {
      if (curr.symbol in accum) {
        accum[curr.symbol] += curr.amount;
      } else {
        accum[curr.symbol] = curr.amount;
      }
    } else if (curr.type === 'sell') {
      if (curr.symbol in accum) {
        accum[curr.symbol] -= curr.amount;
      } else {
        accum[curr.symbol] = -curr.amount;
      }
    }
    return accum;
  }, {});

  let value = Object.keys(symbolsAndAmounts).reduce((accum, curr) => {
    return accum + priceMap[curr] * symbolsAndAmounts[curr];
  }, 0);

  return value;
};

export const makePortfolioLineItems = (transactions, openingPriceMap) =>
  transactions
    .reduce((accum, curr) => {
      if (curr.type === 'init') return accum;
      // console.log(curr);

      let found = accum.find(obj => obj.symbol === curr.symbol);

      if (found) {
        if (curr.type === 'buy') {
          found.amount += curr.amount;
        } else if (curr.type === 'sell') {
          found.amount -= curr.amount;
        }
      } else {
        accum.push({
          symbol: curr.symbol,
          amount: curr.amount,
          // openingPrice: openingPriceMap[curr.symbol],
        });
      }
      return accum;
    }, [])
    .filter(el => el.amount > 0);

export const nanChecker = num => {
  if (Number.isNaN(num)) return 'loading';
  else return num;
};
