export interface AnalyticsResponse {
    available_supply: string
    chart_data: ChartData[]
  }
  export interface ChartData {
    date: string
    closing_price: string
    market_cap: string
  }
  export type Chain = 'ETH' | 'BASE' | "OPTI"
    
  export interface StatsData {
    average_block_time: number
    coin_price: string
    coin_price_change_percentage: number
    gas_prices: {
      slow: number
      average: number
      fast: number
    }
    gas_used_today: string
    market_cap: string
    network_utilization_percentage: number
    total_addresses: string
    total_blocks: string
    total_transactions: string
    transactions_today: string
  }