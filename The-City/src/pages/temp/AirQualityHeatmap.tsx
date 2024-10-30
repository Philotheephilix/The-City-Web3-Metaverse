import { useState } from 'react'

const generateHeatmapData = () => {
  const data = []
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      data.push({
        x: i,
        y: j,
        value: Math.floor(Math.random() * 100)
      })
    }
  }
  return data
}

export default function AirQualityHeatmap() {
  const [heatmapData] = useState(generateHeatmapData())

  const getColor = (value:any) => {
    const hue = ((100 - value) * 120) / 100
    return `hsl(${hue}, 100%, 50%)`
  }

  return (
    <div className="h-64 grid grid-cols-10 gap-1">
      {heatmapData.map((cell, index) => (
        <div
          key={index}
          className="rounded"
          style={{
            backgroundColor: getColor(cell.value),
          }}
          title={`AQI: ${cell.value}`}
        />
      ))}
    </div>
  )
}