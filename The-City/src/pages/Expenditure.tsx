'use client'

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

interface GasMetadata {
  contract_decimals: number
  contract_name: string
  contract_ticker_symbol: string
  contract_address: string
  supports_erc: string[]
  logo_url: string
}

interface Transaction {
  block_signed_at: string
  block_height: number
  tx_hash: string
  tx_offset: number
  successful: boolean
  from_address: string
  to_address: string
  value: string
  value_quote: number
  gas_quote: number
  gas_metadata: GasMetadata
  gas_price: number
  fees_paid: string
}

interface CovalentResponse {
  address: string
  updated_at: string
  next_update_at: string
  quote_currency: string
  chain_id: number
  items: Transaction[]
}

interface TransactionStats {
  total: string
  average: string
  count: number
  totalGas: string
}

const API_KEY = "cqt_rQP7QrcrkRVPtVFc6vCPxcKYQBpk"

const DEPARTMENTS = [
  { name: 'PWD', walletAddress: '0x3fA87a4D992196498f721371617ABC1fFbb6d2b5' },
  { name: 'Medical', walletAddress: '0xb5d85CBf7cB3EE0D56b3bB207D5Fc4B82f43F511' },
  { name: 'Education', walletAddress: '0x3fA87a4D992196498f721371617ABC1fFbb6d2b5' },
]

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const fetchTransactions = async (walletAddress: string): Promise<CovalentResponse> => {
  const API_URL = `https://api.covalenthq.com/v1/eth-mainnet/address/${walletAddress}/transactions_v2/?key=${API_KEY}`
  
  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error("Failed to fetch data")
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("API call failed:", error)
    throw error
  }
}

const calculateStats = (transactions: Transaction[]): TransactionStats => {
  const total = transactions.reduce((sum, tx) => sum + parseFloat(tx.value_quote.toString()), 0)
  const avgValue = total / transactions.length
  const totalGas = transactions.reduce((sum, tx) => sum + parseFloat(tx.gas_quote.toString()), 0)
  
  return {
    total: total.toFixed(2),
    average: avgValue.toFixed(2),
    count: transactions.length,
    totalGas: totalGas.toFixed(2)
  }
}

interface ChartDataPoint {
  date: string
  amount: number
}

const prepareChartData = (transactions: Transaction[]): ChartDataPoint[] => {
  return transactions.map(tx => ({
    date: formatDate(tx.block_signed_at),
    amount: parseFloat(tx.value_quote.toString())
  }))
}

const renderTransactions = (transactions: Transaction[], activeTab: "incoming" | "outgoing") => (
  <Table>
    <TableHeader className="text-slate-300">
      <TableRow>
        <TableHead className="text-slate-300">Date</TableHead>
        <TableHead className="text-slate-300">From/To</TableHead>
        <TableHead className="text-right text-slate-300">Amount (USD)</TableHead>
        <TableHead className="text-right text-slate-300">Gas Fee (USD)</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {transactions.map((tx) => (
        <TableRow key={tx.tx_hash}>
          <TableCell>{formatDate(tx.block_signed_at)}</TableCell>
          <TableCell className="font-mono">
            {activeTab === "incoming" ? 
              `From: ${tx.from_address.slice(0,6)}...${tx.from_address.slice(-4)}` :
              `To: ${tx.to_address.slice(0,6)}...${tx.to_address.slice(-4)}`
            }
          </TableCell>
          <TableCell className="text-right">${tx.value_quote.toFixed(2)}</TableCell>
          <TableCell className="text-right">${tx.gas_quote.toFixed(2)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const renderChart = (transactions: Transaction[]) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={prepareChartData(transactions)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="amount" fill="#8884d8" name="Amount (USD)" />
    </BarChart>
  </ResponsiveContainer>
)

const renderStats = (stats: TransactionStats) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-sm">Total Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${stats.total}</p>
      </CardContent>
    </Card>
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-sm">Transaction Count</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{stats.count}</p>
      </CardContent>
    </Card>
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-sm">Average Value</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${stats.average}</p>
      </CardContent>
    </Card>
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-sm">Total Gas Spent</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${stats.totalGas}</p>
      </CardContent>
    </Card>
  </div>
)

export default function TransactionDashboard() {
  const [data, setData] = useState<CovalentResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming")
  const [activeDepartment, setActiveDepartment] = useState(DEPARTMENTS[0])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchTransactions(activeDepartment.walletAddress)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [activeDepartment])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading transaction data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load transaction data: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const processTransactions = () => {
    const items = data?.items || []
    
    const incoming = items.filter(tx => 
      tx.to_address.toLowerCase() === activeDepartment.walletAddress.toLowerCase()
    )
    
    const outgoing = items.filter(tx => 
      tx.from_address.toLowerCase() === activeDepartment.walletAddress.toLowerCase()
    )
    
    return { incoming, outgoing }
  }

  const { incoming, outgoing } = processTransactions()
  const incomingStats = calculateStats(incoming)
  const outgoingStats = calculateStats(outgoing)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-slate-400">Department Dashboard</CardTitle>
          <CardDescription className="text-slate-300">
            Viewing wallet for: 
            <select 
              value={activeDepartment.name} 
              onChange={(e) => {
                const selectedDept = DEPARTMENTS.find(dept => dept.name === e.target.value)
                if (selectedDept) setActiveDepartment(selectedDept)
              }}
              className="bg-gray-300 text-black ml-2 p-2 rounded-lg"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept.walletAddress} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab}  onValueChange={(val) => setActiveTab(val as "incoming" | "outgoing")}>
        <TabsList>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incoming">
          {renderStats(incomingStats)}
          {renderChart(incoming)}
          {renderTransactions(incoming, "incoming")}
        </TabsContent>
        
        <TabsContent value="outgoing">
          {renderStats(outgoingStats)}
          {renderChart(outgoing)}
          {renderTransactions(outgoing, "outgoing")}
        </TabsContent>
      </Tabs>
    </div>
  )
}
