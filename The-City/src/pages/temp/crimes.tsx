"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingDown, TrendingUp, MapPin } from 'lucide-react'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip, XAxis, YAxis } from 'recharts'

const crimeData = {
  daily: [
    { date: '2023-10-25', theft: 12, assault: 5, burglary: 8, vandalism: 15, fraud: 7 },
    { date: '2023-10-26', theft: 10, assault: 6, burglary: 7, vandalism: 13, fraud: 9 },
    { date: '2023-10-27', theft: 15, assault: 4, burglary: 9, vandalism: 16, fraud: 6 },
    { date: '2023-10-28', theft: 11, assault: 7, burglary: 6, vandalism: 14, fraud: 8 },
    { date: '2023-10-29', theft: 13, assault: 5, burglary: 10, vandalism: 12, fraud: 7 },
    { date: '2023-10-30', theft: 14, assault: 6, burglary: 7, vandalism: 15, fraud: 9 },
    { date: '2023-10-31', theft: 16, assault: 8, burglary: 9, vandalism: 17, fraud: 10 },
  ],
  monthly: [
    { month: 'Jun', theft: 320, assault: 140, burglary: 180, vandalism: 350, fraud: 160 },
    { month: 'Jul', theft: 310, assault: 150, burglary: 170, vandalism: 340, fraud: 170 },
    { month: 'Aug', theft: 340, assault: 130, burglary: 190, vandalism: 360, fraud: 150 },
    { month: 'Sep', theft: 330, assault: 160, burglary: 175, vandalism: 355, fraud: 165 },
    { month: 'Oct', theft: 350, assault: 145, burglary: 185, vandalism: 370, fraud: 155 },
  ]
}

const crimeDistribution = [
  { name: 'Theft', value: 350 },
  { name: 'Assault', value: 145 },
  { name: 'Burglary', value: 185 },
  { name: 'Vandalism', value: 370 },
  { name: 'Fraud', value: 155 },
]

const crimeHotspots = [
  { id: 1, area: 'Central Park', lat: 40.7829, lng: -73.9654, crimeType: 'Theft', riskLevel: 'High' },
  { id: 2, area: 'Downtown', lat: 40.7127, lng: -74.0059, crimeType: 'Assault', riskLevel: 'Medium' },
  { id: 3, area: 'Shopping District', lat: 40.7308, lng: -73.9973, crimeType: 'Burglary', riskLevel: 'High' },
  { id: 4, area: 'Residential Area A', lat: 40.7489, lng: -73.9680, crimeType: 'Vandalism', riskLevel: 'Medium' },
]

const COLORS = ['#f97316', '#facc15', '#4ade80', '#2dd4bf', '#818cf8']

export default function CrimesPage() {
  const [timeFrame, setTimeFrame] = useState('daily')

  return (
    <div className=" w-full px-48 py-8 space-y-6 bg-background text-foreground dark">
      <h1 className="text-3xl font-bold">Crime Statistics and Analysis</h1>

      <Select onValueChange={setTimeFrame} defaultValue={timeFrame}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time frame" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardHeader>
          <CardTitle>Crime Incidents Over Time</CardTitle>
          <CardDescription className="text-muted-foreground">Trend of reported incidents by crime type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={crimeData[timeFrame as 'daily' | 'monthly']}>
              <XAxis dataKey={timeFrame === 'daily' ? 'date' : 'month'} stroke="currentColor" opacity={0.5} />
              <YAxis stroke="currentColor" opacity={0.5} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
              <Legend />
              <Line type="monotone" dataKey="theft" stroke="#FF8042" strokeWidth={2} />
              <Line type="monotone" dataKey="assault" stroke="#FFBB28" strokeWidth={2} />
              <Line type="monotone" dataKey="burglary" stroke="#00C49F" strokeWidth={2} />
              <Line type="monotone" dataKey="vandalism" stroke="#0088FE" strokeWidth={2} />
              <Line type="monotone" dataKey="fraud" stroke="#8884D8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Crime Alert</AlertTitle>
        <AlertDescription>
          Significant increase in theft incidents observed in the shopping district over the past week. Enhanced security measures are being implemented.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crime Distribution</CardTitle>
            <CardDescription className="text-muted-foreground">Breakdown of crime types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={crimeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {crimeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crime Hotspots</CardTitle>
            <CardDescription className="text-muted-foreground">Areas with higher crime rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {crimeHotspots.map((hotspot) => (
                <li key={hotspot.id} className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {hotspot.area} - {hotspot.crimeType}
                  </span>
                  <Badge variant={hotspot.riskLevel === 'High' ? 'destructive' : 'default'}>
                    {hotspot.riskLevel}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crime Trends and Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends" className="w-full">
            <TabsContent value="trends">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <TrendingDown className="h-4 w-4 mr-2 text-green-500" />
                  Overall crime rate down by 5% compared to last year
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
                  Increase in cybercrime incidents, up 15% from previous month
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="insights">
              <ul className="list-disc pl-5 space-y-2">
                <li>Correlation observed between increased foot traffic in shopping districts and theft incidents</li>
                <li>Seasonal pattern detected: burglaries increase by 20% during summer months</li>
                <li>Areas with improved street lighting show a 15% decrease in nighttime crimes</li>
                <li>Online fraud cases are increasingly targeting elderly residents</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predictive Analysis</CardTitle>
          <CardDescription className="text-muted-foreground">Projected crime rates for next month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={crimeData.monthly}>
              <XAxis dataKey="month" stroke="currentColor" opacity={0.5} />
              <YAxis stroke="currentColor" opacity={0.5} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
              <Legend />
              <Bar dataKey="theft" fill="#FF8042" />
              <Bar dataKey="assault" fill="#FFBB28" />
              <Bar dataKey="burglary" fill="#00C49F" />
              <Bar dataKey="vandalism" fill="#0088FE" />
              <Bar dataKey="fraud" fill="#8884D8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Implement community policing programs in high-risk areas</li>
            <li>Enhance surveillance in shopping districts during peak hours</li>
            <li>Conduct cybersecurity awareness campaigns, especially for elderly residents</li>
            <li>Improve street lighting in areas with high nighttime crime rates</li>
            <li>Encourage residents to participate in neighborhood watch programs</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Generate Detailed Report</Button>
      </div>
    </div>
  )
}