"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Wind } from 'lucide-react'
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts'

interface AQIData {
  aqi: number
  pm25: number
  pm10: number
  no2: number
  o3: number
  co: number
}

const aqiData: Record<string, AQIData> = {
  downtown: { aqi: 75, pm25: 15, pm10: 40, no2: 30, o3: 45, co: 5 },
  suburban: { aqi: 45, pm25: 8, pm10: 25, no2: 15, o3: 35, co: 3 },
  industrial: { aqi: 125, pm25: 35, pm10: 70, no2: 50, o3: 60, co: 8 },
}

const pollutantLevels = [
  { name: 'PM2.5', fill: '#8884d8' },
  { name: 'PM10', fill: '#83a6ed' },
  { name: 'NO2', fill: '#8dd1e1' },
  { name: 'O3', fill: '#82ca9d' },
  { name: 'CO', fill: '#ffc658' },
]

export default function AirQualityIndexPage() {
  const [selectedArea, setSelectedArea] = useState('downtown')

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

  const chartData = pollutantLevels.map(pollutant => ({
    name: pollutant.name,
    value: aqiData[selectedArea as keyof typeof aqiData][pollutant.name.toLowerCase() as keyof AQIData],
    fill: pollutant.fill,
  }))

  return (
    <div className="container mx-auto p-4 space-y-4 bg-background text-foreground dark">
      <h1 className="text-3xl font-bold">Air Quality Index</h1>

      <Select onValueChange={(value) => setSelectedArea(value)} defaultValue={selectedArea}>
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
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={chartData}>
              <RadialBar  label={{ position: 'insideStart', fill: '#fff' }} background dataKey="value" />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '6px' }} />
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
