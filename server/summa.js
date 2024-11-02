// const axios = require('axios');

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
//   url: 'https://rest.coinapi.io/v1/ohlcv/BINANCE_SPOT_APE_BUSD/history?period_id=5SEC',
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


// const axios = require('axios');

// let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: 'https://rest.coinapi.io/v1/orderbooks3/COINBASE_SPOT_BCH_USD/current',
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

// const axios = require('axios');

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
// from web3 import Web3
// w3 = Web3(Web3.HTTPProvider("https://polished-winter-replica.quiknode.pro/63c483039293efbb13a69bf1cb9821ade8c5112e"))
// resp = w3.provider.make_request(
//   'bn_gasPrice',
//   [{"chainid":1}]
// )
// print(resp)

// const axios = require('axios');

// async function getGasFeesInEth() {
//   try {
//     const response = await axios({
//       method: 'post',
//       url: 'https://polished-winter-replica.quiknode.pro/63c483039293efbb13a69bf1cb9821ade8c5112e',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       data: {
//         method: 'bn_gasPrice',
//         params: [{ chainid: 1 }],
//         id: 1,
//         jsonrpc: '2.0'
//       }
//     });
//     const blockPrices = response.data.result.blockPrices[0];
//     const estimatedPrices = blockPrices.estimatedPrices;
//     estimatedPrices.forEach(price => {
//       const priceInEth = (price.price * 0.000000001).toFixed(9);
//     });

//     const baseFeeInEth = (blockPrices.baseFeePerGas * 0.000000001).toFixed(9);
//     console.log('\nBase Fee:', baseFeeInEth, 'ETH');
//   } catch (error) {
//     console.error('Error fetching gas fees:', error.message);
//   }
// }

// // Execute the function
// getGasFeesInEth();


const axios = require("axios");

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const data = {
    jsonrpc: "2.0",
    id: 1,
    method: "forex_getExchangeRate",
    params: ["USD", ['INR',"EUR", "GBP", "JPY", "AUD", "CAD"]],
  };
  axios
    .post(
      "https://red-rough-layer.quiknode.pro/c87c920c69f13a451decc29eba290c728a454c1c",
      data,
      config
    )
    .then(function (response) {
      // handle success
      console.log(response.data);
    })



                      