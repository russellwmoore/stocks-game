export const makePriceMap = prices =>
  prices.reduce((accum, current) => {
    accum[current.symbol] = current.price;
    return accum;
  }, {});

export const makeOpeningPriceMap = prices =>
  prices.reduce((accum, current) => {
    accum[current.symbol] = current.openingPrice;
    return accum;
  }, {});

export const makePortfolioValue = (transactions, priceMap) =>
  transactions.reduce((accum, curr) => {
    if (curr.type === 'init') return accum;
    return accum + curr.amount * priceMap[curr.symbol];
  }, 0);

export const makePortFolioLineItems = (transactions, openingPriceMap) =>
  transactions.reduce((accum, curr) => {
    if (curr.type === 'init') return accum;
    let match = -1;
    for (let i = 0; i < accum.length; i++) {
      if (accum[i].symbol === curr.symbol) {
        match = i;
        break;
      }
    }
    if (match === -1) {
      accum.push({
        symbol: curr.symbol,
        amount: curr.amount,
        openingPrice: openingPriceMap[curr.symbol],
      });
    } else {
      accum[match].amount += curr.amount;
    }
    return accum;
  }, []);
