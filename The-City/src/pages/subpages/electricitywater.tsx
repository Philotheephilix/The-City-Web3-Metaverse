"use client"

import { useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Droplet, Zap, TrendingDown, TrendingUp, Plus, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
interface WaterData {
    month: string;
    usage: number;
    rainfall: number;
  }
  
  interface ElectricityData {
    month: string;
    usage: number;
    solar: number;
  }
const initialWaterData = [
  { month: 'Jan', usage: 100, rainfall: 50 },
  { month: 'Feb', usage: 120, rainfall: 40 },
  { month: 'Mar', usage: 110, rainfall: 60 },
  { month: 'Apr', usage: 130, rainfall: 70 },
  { month: 'May', usage: 150, rainfall: 45 },
  { month: 'Jun', usage: 170, rainfall: 30 },
]

const initialElectricityData = [
  { month: 'Jan', usage: 300, solar: 50 },
  { month: 'Feb', usage: 320, solar: 60 },
  { month: 'Mar', usage: 310, solar: 75 },
  { month: 'Apr', usage: 340, solar: 90 },
  { month: 'May', usage: 360, solar: 110 },
  { month: 'Jun', usage: 380, solar: 130 },
]

export default function UtilitiesUsagePage() {
  const [activeTab, setActiveTab] = useState('water')
  const [waterData, setWaterData] = useState(initialWaterData)
  const [electricityData, setElectricityData] = useState(initialElectricityData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newUtilityData, setNewUtilityData] = useState({ month: '', usage: '', secondary: '' })
  const navigate = useNavigate()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUtilityData({ ...newUtilityData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const usage = parseInt(newUtilityData.usage)
    const secondary = parseInt(newUtilityData.secondary)

    if (!newUtilityData.month || isNaN(usage) || isNaN(secondary)) {
        return; // Optionally handle the error with a message
      }
  
      // Create new data entry based on the active tab
      if (activeTab === 'water') {
        const newData: WaterData = {
          month: newUtilityData.month,
          usage: usage,
          rainfall: secondary, // This corresponds to rainfall for water data
        }
        setWaterData([...waterData, newData])
      } else {
        const newData: ElectricityData = {
          month: newUtilityData.month,
          usage: usage,
          solar: secondary, // This corresponds to solar for electricity data
        }
        setElectricityData([...electricityData, newData])
      }
      
      setIsDialogOpen(false)
      setNewUtilityData({ month: '', usage: '', secondary: '' })
    }
  
  return (
    <div className="container mx-auto p-4 space-y-4 bg-background text-foreground dark">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Utilities Usage</h1>
        <div className='flex justify-around gap-8 '> 
        <Button className="bg-green-300 hover:bg-green-500" onClick={() => navigate('/pay')}><CreditCard className="mr-2 h-4 w-4" /> Pay Now</Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button ><Plus className="mr-2 h-4 w-4" /> Add Utility Data</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Utility Data</DialogTitle>
              <DialogDescription>
                Enter the new utility data point here. Click save when you're done.
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
                    value={newUtilityData.month}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="usage" className="text-right">
                    Usage
                  </Label>
                  <Input
                    id="usage"
                    name="usage"
                    type="number"
                    value={newUtilityData.usage}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="secondary" className="text-right">
                    {activeTab === 'water' ? 'Rainfall' : 'Solar'}
                  </Label>
                  <Input
                    id="secondary"
                    name="secondary"
                    type="number"
                
                    value={newUtilityData.secondary}
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
      </div>

      <Tabs defaultValue="water" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="water">Water</TabsTrigger>
          <TabsTrigger value="electricity">Electricity</TabsTrigger>
        </TabsList>
        <TabsContent value="water">
          <Card>
            <CardHeader>
              <CardTitle>Water Consumption and Rainfall</CardTitle>
              <CardDescription>Monthly water usage in gallons and rainfall in inches</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={waterData}>
                  <XAxis dataKey="month" stroke="currentColor" opacity={0.5} />
                  <YAxis yAxisId="left" stroke="currentColor" opacity={0.5} />
                  <YAxis yAxisId="right" orientation="right" stroke="currentColor" opacity={0.5} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="electricity">
          <Card>
            <CardHeader>
              <CardTitle>Electricity Consumption and Solar Generation</CardTitle>
              <CardDescription>Monthly electricity usage and solar power generation in kWh</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={electricityData}>
                  <XAxis dataKey="month" stroke="currentColor" opacity={0.5} />
                  <YAxis stroke="currentColor" opacity={0.5} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
                  <Area type="monotone" dataKey="usage" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                  <Area type="monotone" dataKey="solar" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Usage Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              {activeTab === 'water' ? <Droplet className="h-4 w-4 mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
              {activeTab === 'water' ? 'Water' : 'Electricity'} usage is 
              <Badge variant="outline" className="mx-2">
                {activeTab === 'water' ? '5%' : '3%'}
              </Badge> 
              higher than last month
            </li>
            <li>Peak usage time: {activeTab === 'water' ? '7:00 AM - 9:00 AM' : '6:00 PM - 8:00 PM'}</li>
            <li>Estimated cost for this month: ${activeTab === 'water' ? '85.50' : '120.30'}</li>
            <li className="flex items-center">
              {activeTab === 'water' ? 
                <TrendingDown className="h-4 w-4 mr-2 text-green-500" /> : 
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              }
              {activeTab === 'water' ? 
                'Water conservation efforts reduced usage by 8% in residential areas' : 
                'Solar power generation increased by 15% compared to last year'
              }
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}