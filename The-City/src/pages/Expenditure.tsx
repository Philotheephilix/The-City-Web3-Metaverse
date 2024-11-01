"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
const API_KEY = "cqt_rQP7QrcrkRVPtVFc6vCPxcKYQBpk";
const fetchCovalentData = async (walletAddress: string): Promise<AnalyticsData | null> => {
    const API_URL = `https://api.covalenthq.com/v1/eth-mainnet/address/${walletAddress}/transactions_v2/?key=${API_KEY}`;
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log("hiiiii",data)
      return data.data;
    } catch (error) {
      console.error("API call failed:", error);
      return null;
    }
  };
  fetchCovalentData('0xbFc5E48B2B2FCb711F66286daF39FaEB683E46AE')
const departmentData = {
  government: {
    transactions: [
      { id: 1, date: "2023-05-01", description: "Infrastructure Project", amount: 500000 },
      { id: 2, date: "2023-05-15", description: "Education Fund", amount: 250000 },
      { id: 3, date: "2023-05-30", description: "Healthcare Initiative", amount: 350000 },
    ],
    chartData: [
      { category: "Infrastructure", amount: 500000 },
      { category: "Education", amount: 250000 },
      { category: "Healthcare", amount: 350000 },
    ],
  },
  publicWelfare: {
    transactions: [
      { id: 1, date: "2023-05-03", description: "Food Assistance Program", amount: 100000 },
      { id: 2, date: "2023-05-18", description: "Housing Support", amount: 200000 },
      { id: 3, date: "2023-05-28", description: "Job Training Initiative", amount: 150000 },
    ],
    chartData: [
      { category: "Food Assistance", amount: 100000 },
      { category: "Housing", amount: 200000 },
      { category: "Job Training", amount: 150000 },
    ],
  },
  lawEnforcement: {
    transactions: [
      { id: 1, date: "2023-05-05", description: "Equipment Upgrade", amount: 300000 },
      { id: 2, date: "2023-05-20", description: "Training Program", amount: 150000 },
      { id: 3, date: "2023-05-25", description: "Community Outreach", amount: 100000 },
    ],
    chartData: [
      { category: "Equipment", amount: 300000 },
      { category: "Training", amount: 150000 },
      { category: "Community Outreach", amount: 100000 },
    ],
  },
}

export default function ExpenditureVisual() {
  const [activeTab, setActiveTab] = useState("government")

  const renderTransactions = (transactions: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell className="text-right">${transaction.amount.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderChart = (chartData: any[] | undefined) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Department Transactions Dashboard</CardTitle>
          <CardDescription className="text-gray-400">
            Overview of transactions and analysis for different departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="government">Government</TabsTrigger>
              <TabsTrigger value="publicWelfare">Public Welfare</TabsTrigger>
              <TabsTrigger value="lawEnforcement">Law Enforcement</TabsTrigger>
            </TabsList>
            {Object.entries(departmentData).map(([dept, data]) => (
              <TabsContent key={dept} value={dept}>
                <div className="grid gap-8 md:grid-cols-2">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle>Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent>{renderTransactions(data.transactions)}</CardContent>
                  </Card>
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle>Expenditure Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>{renderChart(data.chartData)}</CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}