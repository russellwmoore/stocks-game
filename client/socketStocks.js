import io from 'socket.io-client';
const url = 'https://ws-api.iextrading.com/1.0/last';
// const { updatePrice } = require('./store');

export const currentStocksSocket = io(url);
//
// currentStocksSocket.on('connect', () => {
//   console.log('stockets working');
//   currentStocksSocket.on('message', message => {
//     console.log('current price', message);
//     // TODO:
//      FIXME: Moved this to portfolio component. Not sure if this will be a memory leak or antipattern
//     // {"symbol":"FB","price":188.9300,"size":100,"time":1564775999605,"seq":2816}
//     // take this shape and run through reducer to add to currentPrices
//     // state.currentPrices: {
//     // symbol:FB
//     // prince: 188.9
//     // }
//   });
// });

// // Disconnect from the channel
// currentStocksSocket.on('disconnect', () => console.log('Disconnected.'));

export const socketsForComponent = update => {
  currentStocksSocket.on('connect', () => {
    console.log('stockets working');
    currentStocksSocket.on('message', message => {
      update(JSON.parse(message));
    });
  });
};

const url2 = 'https://ws-api.iextrading.com/1.0/deep';
const openPriceSocket = require('socket.io-client')(url2);

openPriceSocket.on('connect', () => {
  console.log('stocket open price working');

  openPriceSocket.emit(
    'subscribe',
    JSON.stringify({
      symbols: ['snap'],
      channels: ['officialprice'],
    })
  );
  openPriceSocket.on('message', msg => console.log('opening price: ', msg));
});

// const url3 = 'https://ws-api.iextrading.com/1.0/deep';
// const socketTrades = require('socket.io-client')(url3);

// socketTrades.on('connect', () => {
//   socketTrades.emit(
//     'subscribe',
//     JSON.stringify({
//       symbols: ['f'],
//       channels: ['trades'],
//     })
//   );

//   socketTrades.on('message', msg => {
//     console.log('trades??', msg);
//   });
// });
