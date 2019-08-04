import io from 'socket.io-client';
const url = 'https://ws-api.iextrading.com/1.0/last';

export const currentStocksSocket = io(url);

currentStocksSocket.on('connect', () => {
  console.log('stockets working');
  currentStocksSocket.on('message', message => {
    console.log(message);
    // TODO:
    // {"symbol":"FB","price":188.9300,"size":100,"time":1564775999605,"seq":2816}
    // take this shape and run through reducer to add to currentPrices
    // state.currentPrices: {
    // symbol:FB
    // prince: 188.9
    // }
  });
});

// Disconnect from the channel
currentStocksSocket.on('disconnect', () => console.log('Disconnected.'));

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
