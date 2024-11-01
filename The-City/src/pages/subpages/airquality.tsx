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
import { AlertCircle, Wind, Plus } from 'lucide-react'
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts'

// Define the structure of AQI data
interface AqiData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
}

// Define the initial data for air quality index
const initialAqiData: Record<string, AqiData> = {
  downtown: { aqi: 75, pm25: 15, pm10: 40, no2: 30, o3: 45, co: 5 },
  suburban: { aqi: 45, pm25: 8, pm10: 25, no2: 15, o3: 35, co: 3 },
  industrial: { aqi: 125, pm25: 35, pm10: 70, no2: 50, o3: 60, co: 8 },
}

// Define pollutant levels for chart
const pollutantLevels = [
  { name: 'PM2.5', fill: '#8884d8' },
  { name: 'PM10', fill: '#83a6ed' },
  { name: 'NO2', fill: '#8dd1e1' },
  { name: 'O3', fill: '#82ca9d' },
  { name: 'CO', fill: '#ffc658' },
]

export default function AirQualityIndexPage() {
  const [selectedArea, setSelectedArea] = useState<'downtown' | 'suburban' | 'industrial'>('downtown')
  const [aqiData, setAqiData] = useState<Record<string, AqiData>>(initialAqiData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAqiData, setNewAqiData] = useState<{ area: string; aqi: string; pm25: string; pm10: string; no2: string; o3: string; co: string }>({
    area: '',
    aqi: '',
    pm25: '',
    pm10: '',
    no2: '',
    o3: '',
    co: '',
  })

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-500'
    if (aqi <= 100) return 'bg-yellow-500'
    if (aqi <= 150) return 'bg-orange-500'
    if (aqi <= 200) return 'bg-red-500'
    return 'bg-purple-500'
  }

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
    if (aqi <= 200) return 'Unhealthy'
    return 'Very Unhealthy'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAqiData({ ...newAqiData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newData: AqiData = {
      aqi: parseInt(newAqiData.aqi, 10),
      pm25: parseInt(newAqiData.pm25, 10),
      pm10: parseInt(newAqiData.pm10, 10),
      no2: parseInt(newAqiData.no2, 10),
      o3: parseInt(newAqiData.o3, 10),
      co: parseInt(newAqiData.co, 10),
    }

    if (newAqiData.area) {
      setAqiData({ ...aqiData, [newAqiData.area]: newData })
    }
    
    setIsDialogOpen(false)
    setNewAqiData({ area: '', aqi: '', pm25: '', pm10: '', no2: '', o3: '', co: '' })
  }

  const chartData = pollutantLevels.map(pollutant => ({
    name: pollutant.name,
    value: aqiData[selectedArea][pollutant.name.toLowerCase() as keyof AqiData],
    fill: pollutant.fill,
  }))

  return (
    <div className="container mx-auto p-4 space-y-4 bg-background text-foreground dark">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Air Quality Index</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add AQI Data</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New AQI Data</DialogTitle>
              <DialogDescription>
                Enter the new AQI data point here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="area" className="text-right">Area</Label>
                  <Select onValueChange={(value) => setNewAqiData({ ...newAqiData, area: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downtown">Downtown</SelectItem>
                      <SelectItem value="suburban">Suburban</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {['aqi', 'pm25', 'pm10', 'no2', 'o3', 'co'].map((field) => (
  <div key={field} className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={field} className="text-right">{field.toUpperCase()}</Label>
    <Input
      id={field}
      name={field}
      type="number"
      value={newAqiData[field as keyof typeof newAqiData]} // Use keyof to index correctly
      onChange={handleInputChange}
      className="col-span-3"
      required
    />
  </div>
))}
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Select onValueChange={(value) => setSelectedArea(value as "downtown" | "suburban" | "industrial")} defaultValue={selectedArea}>
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
          <CardTitle>Current AQI for {selectedArea}</CardTitle>
          <CardDescription>Air quality index and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ${getAQIColor(aqiData[selectedArea].aqi)}`}>
              {aqiData[selectedArea].aqi}
            </div>
            <div>
              <p className="text-2xl font-semibold">{getAQIStatus(aqiData[selectedArea].aqi)}</p>
              <Badge variant="outline" className="mt-2">
                {selectedArea}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {aqiData[selectedArea].aqi > 100 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Air Quality Warning</AlertTitle>
          <AlertDescription>
            The air quality in the {selectedArea} area is currently unhealthy for sensitive groups. Please take necessary precautions.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pollutant Levels</CardTitle>
          <CardDescription>Breakdown of air pollutants</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="100%" data={chartData}>
              <RadialBar  label={{ position: 'insideStart', fill: '#fff' }} background dataKey="value" />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip contentStyle={{color:'white', backgroundColor: 'rgba(255,255,255,1)', border: 'none', borderRadius: '6px' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Air Quality Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Wind className="h-4 w-4 mr-2" />
              Primary pollutant: {selectedArea === 'industrial' ? 'PM2.5' : 'Ozone'}
            </li>
            <li>24-hour average AQI: {aqiData[selectedArea].aqi - 5}</li>
            <li>Forecast: {selectedArea === 'suburban' ? 'Improving' : 'Steady'} air quality expected over the next 24 hours</li>
            <li>Recommendation: {aqiData[selectedArea].aqi > 100 ? 'Limit outdoor activities' : 'Enjoy outdoor activities'}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
