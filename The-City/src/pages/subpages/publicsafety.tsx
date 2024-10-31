"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, AlertTriangle, Siren, TrendingDown, TrendingUp } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const safetyAlerts = [
  { id: 1, type: 'emergency', title: 'Flash Flood Warning', description: 'Flash flood warning issued for downtown area. Avoid low-lying areas.', icon: Siren },
  { id: 2, type: 'warning', title: 'Traffic Accident', description: 'Multi-vehicle accident on Highway 101. Expect delays.', icon: AlertTriangle },
  { id: 3, type: 'info', title: 'Community Event', description: 'Annual city parade scheduled for this Saturday. Some roads will be closed.', icon: ShieldCheck },
]

const safetyStats = [
  { title: 'Emergency Response Time', value: '4.2 minutes', change: 'decreased', percentage: '8%' },
  { title: 'Active Police Patrols', value: '28', change: 'increased', percentage: '12%' },
  { title: 'Reported Incidents (24h)', value: '17', change: 'decreased', percentage: '5%' },
]

const incidentTypes = [
  { name: 'Traffic', value: 35 },
  { name: 'Property Crime', value: 25 },
  { name: 'Violent Crime', value: 10 },
  { name: 'Medical Emergency', value: 20 },
  { name: 'Fire', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function PublicSafetyPage() {
  return (
    <div className="container mx-auto p-4 space-y-4 bg-background text-foreground dark">
      <h1 className="text-3xl font-bold">Public Safety Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {safetyStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stat.change === 'decreased' ? (
                  <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
                )}
                {stat.percentage} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Safety Alerts</CardTitle>
          <CardDescription>Latest updates and warnings</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {safetyAlerts.map((alert) => (
              <Alert key={alert.id} variant={alert.type === 'emergency' ? 'destructive' : (alert.type === 'destructive' ? 'destructive' : 'destructive')}>
                <alert.icon className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>
                  {alert.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incident Type Distribution</CardTitle>
          <CardDescription>Breakdown of reported incidents in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incidentTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incidentTypes.map((entry, index) => (
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
          <CardTitle>Safety Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep emergency contact numbers handy</li>
            <li>Sign up for city-wide emergency alerts</li>
            <li>Know your nearest emergency shelters</li>
            <li>Participate in community safety programs</li>
            <li>Report suspicious activities to local authorities</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}