import { COIN_API_KEY } from '@/constants'
import { OrderBook,Quote } from './Types'
import axios from "axios"

export const fetchOrderBook = async (): Promise<OrderBook> => {
    const response = await axios.get('https://rest.coinapi.io/v1/orderbooks3/COINBASE_SPOT_BCH_USD/current', {
      headers: {
        'X-CoinAPI-Key': COIN_API_KEY,
        'Accept': 'application/json',
      },
    })
    return response.data
  }
  
export const fetchQuote = async (): Promise<Quote[]> => {
    const response = await axios.get('https://rest.coinapi.io/v1/quotes/current?filter_symbol_id=BITSTAMP_SPOT_BTC_USD', {
      headers: {
        'X-CoinAPI-Key': COIN_API_KEY,
        'Accept': 'application/json',
      },
    })
    return response.data
  }
  