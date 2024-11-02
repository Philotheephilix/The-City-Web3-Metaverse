import { Chain,AnalyticsResponse,StatsData } from '../../utils/blockscout/Types'
const API_ENDPOINTS: Record<Chain, string> = {
    ETH: "https://eth.blockscout.com/api/v2/stats/charts/market",
    BASE: "https://base.blockscout.com/api/v2/stats/charts/market",
    OPTI:"https://optimism.blockscout.com/api/v2/stats/charts/market"
  }
  
  const STATS_ENDPOINT: Record<Chain, string>  = {
      ETH : "https://eth.blockscout.com/api/v2/stats",
      BASE : "https://base.blockscout.com/api/v2/stats",
      OPTI:"https://optimism.blockscout.com/api/v2/stats"
  }
  export const fetchAnalyticsData = async (chain: Chain) => {
    const endpoint = API_ENDPOINTS[chain]
    try {
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Network response was not ok')
      const data: AnalyticsResponse = await response.json()
      data.chart_data.reverse()
      return data
    } catch (error) {
      console.error("API call failed:", error)
      return null
    }
  }

export  const fetchStatsData = async (chain: Chain) => {
    try {
      const response = await fetch(STATS_ENDPOINT[chain])
      if (!response.ok) throw new Error('Network response was not ok')
      const data: StatsData = await response.json()
      return data
    } catch (error) {
      console.error("Stats API call failed:", error)
      return null
    }
  }
