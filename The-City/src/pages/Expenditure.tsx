'use client'

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"
import { calculateStats, fetchTransactions } from "@/utils/covalent/History"
import { ChartDataPoint, CovalentResponse, Transaction, TransactionStats } from "@/utils/covalent/Types"
import { Button } from "@/components/ui/button"
import CovalentLogo from "../assets/Covalent.svg"

const DEPARTMENTS = [
  { name: 'PWD', walletAddress: '0x3fA87a4D992196498f721371617ABC1fFbb6d2b5' },
  { name: 'Medical', walletAddress: '0xb5d85CBf7cB3EE0D56b3bB207D5Fc4B82f43F511' },
  { name: 'Education', walletAddress: '0x3fA87a4D992196498f721371617ABC1fFbb6d2b5' },
]

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const prepareChartData = (transactions: Transaction[]): ChartDataPoint[] => {
  return transactions.map(tx => ({
    date: formatDate(tx.block_signed_at),
    amount: parseFloat(tx.value_quote.toString())
  }))
}

const renderTransactions = (transactions: Transaction[], activeTab: "incoming" | "outgoing") => (
  <div>
    <h2 className="mt-8 text-2xl text-bold">Government Transactions </h2>
  <Table className="bg-black p-2">
    <TableHeader className="text-white bg-black">
      <TableRow>
        <TableHead className="text-white">Date</TableHead>
        <TableHead className="text-white">From/To</TableHead>
        <TableHead className="text-right text-white">Amount (USD)</TableHead>
        <TableHead className="text-right text-white">Gas Fee (USD)</TableHead>
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
  </div>
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
    <Card className="bg-gray-300 border-gray-600">
      <CardHeader>
        <CardTitle className="text-sm">Total Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${stats.total}</p>
      </CardContent>
    </Card>
    <Card className="bg-gray-300 border-gray-600">
      <CardHeader>
        <CardTitle className="text-sm">Transaction Count</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{stats.count}</p>
      </CardContent>
    </Card>
    <Card className="bg-gray-300 border-gray-600">
      <CardHeader>
        <CardTitle className="text-sm">Average Value</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${stats.average}</p>
      </CardContent>
    </Card>
    <Card className="bg-gray-300 border-gray-600">
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
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
    <div className="min-h-screen bg-black text-white px-32 py-4 m-auto">
      <Card className="bg-gray-800 border-gray-900 mb-8">
        <CardHeader className="flex flex-row justify-around">
          <div></div>
          <div></div>
          <div>
          <CardTitle className="text-xl text-white">Department Dashboard</CardTitle>
          <CardDescription className="text-slate-300">
            Viewing wallet for: 
            <select 
              value={activeDepartment.name} 
              onChange={(e) => {
                const selectedDept = DEPARTMENTS.find(dept => dept.name === e.target.value)
                if (selectedDept) setActiveDepartment(selectedDept)
              }}
              className="bg-white text-black ml-2 p-2 rounded-lg"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept.walletAddress} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </CardDescription>
          </div>
          <div  className="px-4 py-4 w-32 bg-black border-white text-white rounded-md  hover:bg-black">
              <img src={CovalentLogo} alt=""  />
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab}  onValueChange={(val) => setActiveTab(val as "incoming" | "outgoing")} className="mb-2">
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
