"use client"

import { useState } from 'react'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Car, TrendingDown, TrendingUp, Plus } from 'lucide-react'

const initialTrafficData = [
  { time: '00:00', volume: 120, speed: 55 },
  { time: '03:00', volume: 80, speed: 60 },
  { time: '06:00', volume: 200, speed: 45 },
  { time: '09:00', volume: 500, speed: 30 },
  { time: '12:00', volume: 350, speed: 40 },
  { time: '15:00', volume: 450, speed: 35 },
  { time: '18:00', volume: 550, speed: 25 },
  { time: '21:00', volume: 300, speed: 50 },
]

const congestionTrend = [
  { day: 'Mon', index: 65 },
  { day: 'Tue', index: 68 },
  { day: 'Wed', index: 62 },
  { day: 'Thu', index: 70 },
  { day: 'Fri', index: 75 },
  { day: 'Sat', index: 58 },
  { day: 'Sun', index: 50 },
]

export default function TrafficFlowPage() {
  const [selectedArea, setSelectedArea] = useState('downtown')
  const [trafficData, setTrafficData] = useState(initialTrafficData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTrafficData, setNewTrafficData] = useState({ time: '', volume: '', speed: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTrafficData({ ...newTrafficData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newData = {
      time: newTrafficData.time,
      volume: parseInt(newTrafficData.volume),
      speed: parseInt(newTrafficData.speed)
    }
    setTrafficData([...trafficData, newData])
    setIsDialogOpen(false)
    setNewTrafficData({ time: '', volume: '', speed: '' })
  }

  return (
    <div className="container mx-auto p-4 space-y-4 bg-background text-foreground dark">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Traffic Flow Analysis</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Traffic Data</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Traffic Data</DialogTitle>
              <DialogDescription>
                Enter the new traffic data point here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    value={newTrafficData.time}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="volume" className="text-right">
                    Volume
                  </Label>
                  <Input
                    id="volume"
                    name="volume"
                    type="number"
                    value={newTrafficData.volume}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="speed" className="text-right">
                    Speed
                  </Label>
                  <Input
                    id="speed"
                    name="speed"
                    type="number"
                    value={newTrafficData.speed}
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
          <SelectItem value="highway">Highway</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Traffic Volume and Speed</CardTitle>
          <CardDescription>Traffic flow in {selectedArea} area</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <XAxis dataKey="time" stroke="currentColor" opacity={0.5} />
              <YAxis yAxisId="left" stroke="currentColor" opacity={0.5} />
              <YAxis yAxisId="right" orientation="right" stroke="currentColor" opacity={0.5} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
              <Line yAxisId="left" type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Traffic Advisory</AlertTitle>
        <AlertDescription>
          Heavy traffic expected in the downtown area due to ongoing construction. Please plan your route accordingly.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Congestion Trend</CardTitle>
            <CardDescription>Congestion index by day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={congestionTrend}>
                <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
                <YAxis stroke="currentColor" opacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
                <Bar dataKey="index" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Peak hours: 8:00 AM - 9:00 AM and 5:00 PM - 6:00 PM
              </li>
              <li className="flex items-center">
                <Badge variant="outline" className="mr-2">25 mph</Badge>
                Average speed during peak hours
              </li>
              <li className="flex items-center">
                <TrendingDown className="h-4 w-4 mr-2 text-green-500" />
                10% decrease in overall congestion compared to last month
              </li>
              <li className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
                15% increase in bicycle traffic on dedicated lanes
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}