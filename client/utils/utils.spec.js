import {
  makePriceMap,
  makeOpeningPriceMap,
  makePortfolioValue,
  makePortFolioLineItems,
} from './index';

describe('Check util Functions', () => {
  const prices = [
    { symbol: 'KO', price: 10, openingPrice: 12.5, time: 1565121633757 },
    {
      symbol: 'FB',
      price: 50.5,
      size: 100,
      openingPrice: 50,
      time: 1565121599931,
    },
    {
      symbol: 'F',
      price: 5.25,
      size: 3,
      openingPrice: 6,
      time: 1565121691888,
    },
  ];

  const transactions = [
    { id: 1, price: '5000', symbol: null, type: 'init', amount: null },
    { id: 3, price: '4', symbol: 'F', type: 'buy', amount: 120 },
    { id: 5, price: '12', symbol: 'KO', type: 'buy', amount: 20 },
    { id: 6, price: '8', symbol: 'KO', type: 'buy', amount: 15 },
    { id: 7, price: '45', symbol: 'FB', type: 'buy', amount: 10 },
  ];

  let map, expectedMap, portfolioValue, portfolioLineItems, openingPriceMap;

  describe('makePriceMap function', () => {
    map = makePriceMap(prices);
    expectedMap = { KO: 10, FB: 50.5, F: 5.25 };

    it('Returns an object', () => {
      expect(typeof map).toBe('object');
      expect(Array.isArray(map)).toBe(false);
    });
    it('Creates an Object with a symbol and a current price', () => {
      expect(expectedMap).toEqual(map);
    });
  });

  describe('Make Portfolio Value', () => {
    portfolioValue = makePortfolioValue(transactions, map);
    // TODO: break this out more to test functionality of the map
    it('returns a number', () => {
      expect(typeof portfolioValue).toBe('number');
    });
    it('Multiplies the number of stocks by the current value of the corresponding ticker symbol', () => {
      expect(portfolioValue).toBe(1485);
    });
  });

  describe('Make Portfolio Line Items', () => {
    openingPriceMap = makeOpeningPriceMap(prices);
    portfolioLineItems = makePortFolioLineItems(transactions, openingPriceMap);
    const lineItems = [
      { symbol: 'F', amount: 120, openingPrice: 6 },
      { symbol: 'KO', amount: 35, openingPrice: 12.5 },
      { symbol: 'FB', amount: 10, openingPrice: 50 },
    ];
    it('returns an array', () => {
      expect(Array.isArray(portfolioLineItems)).toBe(true);
    });

    it('Combines all transactions with like symbols into one line with updated amounts, and inlcudes opening prices', () => {
      expect(portfolioLineItems).toEqual(lineItems);
    });
  });
});
