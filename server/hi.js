 const axios = require('axios');

// let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: 'https://rest.coinapi.io/v1/symbols',
//   headers: { 
//     'Accept': 'text/plain', 
//     'X-CoinAPI-Key': '92080a06-9fbe-42ff-9cfd-425bf6709458'
//   }
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });


//down works
// let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: 'https://rest.coinapi.io/v1/ohlcv/BINANCE_SPOT_NEO_BTC/history?period_id=15SEC',
//   headers: { 
//     'Accept': 'text/plain', 
//     'X-CoinAPI-Key': '92080a06-9fbe-42ff-9cfd-425bf6709458'
//   }
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });

 let config = {
   method: 'get',
   maxBodyLength: Infinity,
   url: 'https://rest.coinapi.io/v1/orderbooks3/COINBASE_SPOT_BCH_USD/current',
   headers: { 
     'Accept': 'text/plain', 
     'X-CoinAPI-Key': '92080a06-9fbe-42ff-9cfd-425bf6709458'
   }
 };
 axios.request(config)
 .then((response) => {

   console.log(JSON.stringify(response.data));
 })
 .catch((error) => {
   console.log(error);
 });

// let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: 'https://rest.coinapi.io/v1/quotes/current?filter_symbol_id=BITSTAMP_SPOT_BTC_USD',
//   headers: { 
//     'Accept': 'text/plain', 
//     'X-CoinAPI-Key': '92080a06-9fbe-42ff-9cfd-425bf6709458'
//   }
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });