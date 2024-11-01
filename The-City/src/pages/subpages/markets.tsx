"use client"

import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from 'date-fns'
import { ArrowUpRight, ArrowDownRight, Clock, Zap, Database, Blocks, Wallet, Activity } from 'lucide-react'

type Chain = 'ETH' | 'BASE' | "OPTI"

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

interface ChartData {
  date: string
  closing_price: string
  market_cap: string
}

interface AnalyticsResponse {
  available_supply: string
  chart_data: ChartData[]
}

interface StatsData {
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

export default function Component() {
  const [selectedChain, setSelectedChain] = useState<Chain>('ETH')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null)
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalyticsData = async (chain: Chain) => {
    const endpoint = API_ENDPOINTS[chain]
    try {
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Network response was not ok')
      const data: AnalyticsResponse = await response.json()
      data.chart_data.reverse() // Reverse the data array here
      return data
    } catch (error) {
      console.error("API call failed:", error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      return null
    }
  }

  const fetchStatsData = async (chain: Chain) => {
    try {
      const response = await fetch(STATS_ENDPOINT[chain])
      if (!response.ok) throw new Error('Network response was not ok')
      const data: StatsData = await response.json()
      return data
    } catch (error) {
      console.error("Stats API call failed:", error)
      setError(error instanceof Error ? error.message : 'An error occurred fetching stats')
      return null
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      const [analytics, stats] = await Promise.all([
        fetchAnalyticsData(selectedChain),
        fetchStatsData(selectedChain)
      ])
      setAnalyticsData(analytics)
      setStatsData(stats)
      setLoading(false)
    }

    fetchData()
  }, [selectedChain])

  const formatChartData = (data: ChartData[] | undefined) => {
    if (!data) return []
    return data.map(item => ({
      ...item,
      date: format(new Date(item.date), 'MMM dd'),
      market_cap: parseFloat(item.market_cap) || 0
    }))
  }

  const renderChart = () => {
    if (!analyticsData || !analyticsData.chart_data) return null

    return (
        <div className="flex justify-center  h-[500px]">
          <ChartContainer
            config={{
              market_cap: {
                label: "Market Cap",
                color: "black",
              },
            }}
            className="flex justify-center"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatChartData(analyticsData.chart_data)} className="m-auto">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="market_cap" stroke="green" strokeWidth={7} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )
  }

  const renderStats = () => {
    if (!statsData) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Coin Price"
          value={`$${parseFloat(statsData.coin_price || '0').toFixed(2)}`}
          change={statsData.coin_price_change_percentage}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          title="Market Cap"
          value={`$${(parseFloat(statsData.market_cap || '0') / 1e9).toFixed(2)}B`}
          icon={<Database className="h-4 w-4" />}
        />
        <StatCard
          title="Avg Block Time"
          value={`${((statsData.average_block_time || 0) / 1000).toFixed(2)}s`}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Network Utilization"
          value={`${(statsData.network_utilization_percentage || 0).toFixed(2)}%`}
          icon={<Zap className="h-4 w-4" />}
        />
        <StatCard
          title="Total Addresses"
          value={parseInt(statsData.total_addresses || '0').toLocaleString()}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          title="Total Blocks"
          value={parseInt(statsData.total_blocks || '0').toLocaleString()}
          icon={<Blocks className="h-4 w-4" />}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 dark">
      <Card className="w-full bg-background text-foreground">
        <CardHeader>
          <CardTitle>Blockchain Analytics</CardTitle>
          <CardDescription>Market cap analysis and statistics for different cryptocurrencies</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedChain}
            onValueChange={(value) => setSelectedChain(value as Chain)}
          >
            <SelectTrigger className="w-[180px] mb-4">
              <SelectValue placeholder="Select a chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ETH">Ethereum</SelectItem>
              <SelectItem value="BASE">Base</SelectItem>
              <SelectItem value="OPTI">Optimum</SelectItem>

            </SelectContent>
          </Select>

          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p className="text-red-500">Error fetching data: {error}</p>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl mb-2">Market Cap Chart for {selectedChain}</h2>
                {renderChart()}
              </div>
              <div>
                <h2 className="text-xl mb-2">Blockchain Statistics</h2>
                {renderStats()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  change?: number
  icon: React.ReactNode
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card className="bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon}
        </div>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold">{value}</p>
          {change !== undefined && (
            <span className={`ml-2 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? <ArrowUpRight className="inline h-4 w-4" /> : <ArrowDownRight className="inline h-4 w-4" />}
              {Math.abs(change).toFixed(2)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}