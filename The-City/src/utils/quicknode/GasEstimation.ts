import axios from 'axios';

export async function getGasFeesInEth() {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://polished-winter-replica.quiknode.pro/63c483039293efbb13a69bf1cb9821ade8c5112e',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        method: 'bn_gasPrice',
        params: [{ chainid: 1 }],
        id: 1,
        jsonrpc: '2.0'
      }
    });
    const blockPrices = response.data.result.blockPrices[0];
    const estimatedPrices = blockPrices.estimatedPrices;
    estimatedPrices.forEach((_price: { price: number; }) => {
    });

    const baseFeeInEth = (blockPrices.baseFeePerGas * 0.000000001).toFixed(9);
    return baseFeeInEth
  } catch (error) {
    
  }
}
export async function forex() {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
        jsonrpc: "2.0",
        id: 1,
        method: "forex_getExchangeRate",
        params: ["USD", ["EUR", "GBP", "JPY", "AUD", "CAD"]],
      };
      axios
        .post(
          "https://empty-frequent-resonance.quiknode.pro/ec6fb68fd0c1c9238bedfcf82b78a0c7df984ba0",
          data,
          config
        )
        .then(function (response) {
          console.log(response.data);
        })
        .catch();
}
forex()