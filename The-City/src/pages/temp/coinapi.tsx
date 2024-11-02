"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

const API_KEY = '92080a06-9fbe-42ff-9cfd-425bf6709458'

interface LastTrade {
  price: number
  size: number
  taker_side: "BUY" | "SELL"
}

interface OrderBookEntry {
  id: string
  price: number
  size: number
}

interface OrderBook {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

interface Quote {
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

const fetchOrderBook = async (): Promise<OrderBook> => {
  const response = await axios.get('https://rest.coinapi.io/v1/orderbooks3/COINBASE_SPOT_BCH_USD/current', {
    headers: {
      'X-CoinAPI-Key': API_KEY,
      'Accept': 'application/json',
    },
  })
  return response.data
}

const fetchQuote = async (): Promise<Quote[]> => {
  const response = await axios.get('https://rest.coinapi.io/v1/quotes/current?filter_symbol_id=BITSTAMP_SPOT_BTC_USD', {
    headers: {
      'X-CoinAPI-Key': API_KEY,
      'Accept': 'application/json',
    },
  })
  return response.data
}

export default function EnhancedCryptoDashboard() {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderBookData = await fetchOrderBook()
        const limitedOrderBook = {
          ...orderBookData,
          bids: orderBookData.bids.slice(0, 10),
          asks: orderBookData.asks.slice(0, 10),
        }

        const quotesData = await fetchQuote()
        const limitedQuotes = quotesData.slice(0, 10)

        setOrderBook(limitedOrderBook)
        setQuotes(limitedQuotes)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const orderBookChartData = orderBook
    ? [...orderBook.bids, ...orderBook.asks].map((entry) => ({
        price: entry.price,
        size: entry.size,
        type: orderBook.bids.includes(entry) ? "Bid" : "Ask",
      }))
    : []

  const quoteChartData = quotes.map((quote, index) => ({
    time: new Date(quote.time_exchange).toLocaleTimeString(),
    askPrice: quote.ask_price,
    bidPrice: quote.bid_price,
    tradePrice: quote.last_trade.price,
    index: index,
  }))

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8 border rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Crypto Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-black border-grey-800">
          <CardHeader>
            <CardTitle>Order Book Visualization (BCH/USD)</CardTitle>
            <CardDescription>Top 10 bids and asks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                size: {
                  label: "Size",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderBookChartData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="price" type="category" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="size" fill="var(--color-size)">
                    {orderBookChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.type === "Bid" ? "rgba(52, 211, 153, 0.8)" : "rgba(239, 68, 68, 0.8)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-black border-grey-800">
          <CardHeader>
            <CardTitle>BTC/USD Price Movements</CardTitle>
            <CardDescription>Ask, Bid, and Trade prices over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                askPrice: {
                  label: "Ask Price",
                  color: "hsl(var(--chart-1))",
                },
                bidPrice: {
                  label: "Bid Price",
                  color: "hsl(var(--chart-2))",
                },
                tradePrice: {
                  label: "Trade Price",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quoteChartData}>
                  <XAxis dataKey="index" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="askPrice" stroke="#60A5FA" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bidPrice" stroke="#34D399" strokeWidth={2} dot={false} />
                  <Line 
                    type="monotone" 
                    dataKey="tradePrice" 
                    stroke="#FBBF24" 
                    strokeWidth={2}
                    dot={{ stroke: '#FBBF24', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-black border-grey-800 col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Recent BTC/USD Quotes</CardTitle>
            <CardDescription>Latest market data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Time</TableHead>
                    <TableHead className="text-gray-300">Ask Price</TableHead>
                    <TableHead className="text-gray-300">Bid Price</TableHead>
                    <TableHead className="text-gray-300">Last Trade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote, index) => (
                    <TableRow key={index} className="hover:bg-gray-700 transition-colors">
                      <TableCell className="font-mono">{new Date(quote.time_exchange).toLocaleString()}</TableCell>
                      <TableCell className="text-blue-400">{quote.ask_price.toFixed(2)}</TableCell>
                      <TableCell className="text-green-400">{quote.bid_price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={quote.last_trade.taker_side === "BUY" ? "text-green-400" : "text-red-400"}>
                          {quote.last_trade.price.toFixed(2)}
                          {quote.last_trade.taker_side === "BUY" ? (
                            <ArrowUpIcon className="inline ml-1" />
                          ) : (
                            <ArrowDownIcon className="inline ml-1" />
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}