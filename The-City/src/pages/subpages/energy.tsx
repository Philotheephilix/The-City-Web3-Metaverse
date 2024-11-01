"use client"

import { useState } from 'react'
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingDown, TrendingUp } from 'lucide-react'

const energyData = {
  residential: [
    { name: 'Heating', value: 40 },
    { name: 'Cooling', value: 20 },
    { name: 'Lighting', value: 15 },
    { name: 'Appliances', value: 25 },
  ],
  commercial: [
    { name: 'HVAC', value: 35 },
    { name: 'Lighting', value: 25 },
    { name: 'Electronics', value: 20 },
    { name: 'Other', value: 20 },
  ],
  industrial: [
    { name: 'Manufacturing', value: 50 },
    { name: 'Lighting', value: 10 },
    { name: 'HVAC', value: 15 },
    { name: 'Other', value: 25 },
  ],
}

const energyTrend = [
  { month: 'Jan', consumption: 300, renewable: 50 },
  { month: 'Feb', consumption: 320, renewable: 60 },
  { month: 'Mar', consumption: 310, renewable: 75 },
  { month: 'Apr', consumption: 340, renewable: 90 },
  { month: 'May', consumption: 360, renewable: 110 },
  { month: 'Jun', consumption: 380, renewable: 130 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function EnergyConsumptionPage() {
  const [selectedSector, setSelectedSector] = useState<'residential' | 'commercial' | 'industrial'>('residential')

  return (
    <div className="container mx-auto p-4 space-y-4 bg-background text-foreground dark">
      <h1 className="text-3xl font-bold">Energy Consumption Analysis</h1>

      <Select value={selectedSector} onValueChange={(value) => setSelectedSector(value as 'residential' | 'commercial' | 'industrial')}>
      <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select sector" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="residential">Residential</SelectItem>
          <SelectItem value="commercial">Commercial</SelectItem>
          <SelectItem value="industrial">Industrial</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Breakdown</CardTitle>
            <CardDescription>Distribution of energy usage in the {selectedSector} sector</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energyData[selectedSector]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {energyData[selectedSector].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '6px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Trend</CardTitle>
            <CardDescription>Monthly energy consumption and renewable energy generation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={energyTrend}>
                <XAxis dataKey="month" stroke="currentColor" opacity={0.5} />
                <YAxis stroke="currentColor" opacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
                <Area type="monotone" dataKey="consumption" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
                <Area type="monotone" dataKey="renewable" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Alert variant="default">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Energy Saving Tip</AlertTitle>
        <AlertDescription>
          {selectedSector === 'residential' 
            ? 'Use smart thermostats to optimize heating and cooling.' 
            : selectedSector === 'commercial'
            ? 'Implement occupancy sensors for lighting in less-used areas.'
            : 'Conduct regular maintenance on manufacturing equipment to improve efficiency.'}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Total energy consumption:</span>
              <Badge variant="outline">
                {selectedSector === 'residential' ? '450' : selectedSector === 'commercial' ? '780' : '1200'} kWh
              </Badge>
            </li>
            <li className="flex items-center justify-between">
              <span>Renewable energy percentage:</span>
              <Badge variant="outline" className="bg-green-500 text-white">
                {selectedSector === 'residential' ? '15%' : selectedSector === 'commercial' ? '22%' : '18%'}
              </Badge>
            </li>
            <li className="flex items-center">
              {selectedSector === 'residential' ? (
                <TrendingDown className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
              )}
              {selectedSector === 'residential'
                ? '5% decrease in energy consumption compared to last month'
                : selectedSector === 'commercial'
                ? '3% increase in energy efficiency due to smart building technologies'
                : '8% increase in renewable energy utilization in manufacturing processes'}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
