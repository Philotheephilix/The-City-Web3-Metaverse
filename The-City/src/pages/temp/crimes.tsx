"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, TrendingDown, TrendingUp, Plus } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const initialCrimeData = [
  { month: 'Jan', violent: 45, property: 120, cyber: 30 },
  { month: 'Feb', violent: 50, property: 115, cyber: 35 },
  { month: 'Mar', violent: 40, property: 130, cyber: 40 },
  { month: 'Apr', violent: 55, property: 125, cyber: 38 },
  { month: 'May', violent: 60, property: 140, cyber: 45 },
  { month: 'Jun', violent: 52, property: 135, cyber: 50 },
]

const initialCrimeTypes = [
  { name: 'Assault', value: 30 },
  { name: 'Burglary', value: 25 },
  { name: 'Theft', value: 20 },
  { name: 'Fraud', value: 15 },
  { name: 'Vandalism', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function CrimesPage() {
  const [crimeData, setCrimeData] = useState(initialCrimeData)
  const [crimeTypes, setCrimeTypes] = useState(initialCrimeTypes)
  const [selectedArea, setSelectedArea] = useState('downtown')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCrimeData, setNewCrimeData] = useState({ month: '', violent: '', property: '', cyber: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCrimeData({ ...newCrimeData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newData = {
      month: newCrimeData.month,
      violent: parseInt(newCrimeData.violent),
      property: parseInt(newCrimeData.property),
      cyber: parseInt(newCrimeData.cyber),
    }
    setCrimeData([...crimeData, newData])
    setIsDialogOpen(false)
    setNewCrimeData({ month: '', violent: '', property: '', cyber: '' })
  }

  return (
    <div className="container mx-auto p-4 space-y-4 bg-background text-foreground dark">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Crime Statistics Dashboard</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Crime Data</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Crime Data</DialogTitle>
              <DialogDescription>
                Enter the new crime data point here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="month" className="text-right">
                    Month
                  </Label>
                  <Input
                    id="month"
                    name="month"
                    value={newCrimeData.month}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="violent" className="text-right">
                    Violent
                  </Label>
                  <Input
                    id="violent"
                    name="violent"
                    type="number"
                    value={newCrimeData.violent}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="property" className="text-right">
                    Property
                  </Label>
                  <Input
                    id="property"
                    name="property"
                    type="number"
                    value={newCrimeData.property}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cyber" className="text-right">
                    Cyber
                  </Label>
                  <Input
                    id="cyber"
                    name="cyber"
                    type="number"
                    value={newCrimeData.cyber}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Select onValueChange={setSelectedArea} defaultValue={selectedArea}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select area" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="downtown">Downtown</SelectItem>
          <SelectItem value="suburban">Suburban</SelectItem>
          <SelectItem value="industrial">Industrial</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardHeader>
          <CardTitle>Crime Trends</CardTitle>
          <CardDescription>Monthly breakdown of crime categories in {selectedArea} area</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={crimeData}>
              <XAxis dataKey="month" stroke="currentColor" opacity={0.5} />
              <YAxis stroke="currentColor" opacity={0.5} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
              <Legend />
              <Bar dataKey="violent" fill="#ef4444" />
              <Bar dataKey="property" fill="#3b82f6" />
              <Bar dataKey="cyber" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Crime Hotspot Alert</AlertTitle>
        <AlertDescription>
          Increased property crimes reported in the {selectedArea} area. Extra patrols have been deployed.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Crime Type Distribution</CardTitle>
            <CardDescription>Breakdown of reported crimes by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={crimeTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {crimeTypes.map((entry, index) => (
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
            <CardTitle>Crime Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>Total reported crimes (last 30 days):</span>
                <Badge variant="outline">
                  {crimeData.reduce((acc, curr) => acc + curr.violent + curr.property + curr.cyber, 0)}
                </Badge>
              </li>
              <li className="flex items-center justify-between">
                <span>Most common crime type:</span>
                <Badge variant="outline" className="bg-primary text-primary-foreground">
                  {crimeTypes.reduce((prev, current) => (prev.value > current.value) ? prev : current).name}
                </Badge>
              </li>
              <li className="flex items-center">
                <TrendingDown className="h-4 w-4 mr-2 text-green-500" />
                5% decrease in violent crimes compared to last month
              </li>
              <li className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
                12% increase in cybercrime reports over the past quarter
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crime Prevention Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Increase community policing efforts in high-crime areas</li>
            <li>Implement neighborhood watch programs</li>
            <li>Enhance street lighting in vulnerable locations</li>
            <li>Provide cybersecurity awareness training for residents and businesses</li>
            <li>Expand youth engagement programs to reduce juvenile delinquency</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}