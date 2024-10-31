import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { name: '00:00', water: 400, electricity: 240 },
  { name: '04:00', water: 300, electricity: 139 },
  { name: '08:00', water: 200, electricity: 980 },
  { name: '12:00', water: 278, electricity: 390 },
  { name: '16:00', water: 189, electricity: 480 },
  { name: '20:00', water: 239, electricity: 380 },
  { name: '23:59', water: 349, electricity: 430 },
]

export default function UtilitiesGraph() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kWh`} />
        <Tooltip />
        <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} />
        <Line type="monotone" dataKey="electricity" stroke="#22c55e" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}