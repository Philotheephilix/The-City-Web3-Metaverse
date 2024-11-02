
export interface LastTrade {
    price: number
    size: number
    taker_side: "BUY" | "SELL"
  }
  
 export interface OrderBookEntry {
    id: string
    price: number
    size: number
  }
  
 export interface OrderBook {
    bids: OrderBookEntry[]
    asks: OrderBookEntry[]
  }
  
 export interface Quote {
    symbol_id: string
    ask_price: number
    ask_size: number
    bid_price: number
    bid_size: number
    last_trade: LastTrade
    time_coinapi: string
    time_exchange: string
    uuid: string
  }
  