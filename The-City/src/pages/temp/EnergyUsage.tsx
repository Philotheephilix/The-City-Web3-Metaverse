import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from 'recharts'

const data = [
  { name: 'Residential', value: 400 },
  { name: 'Commercial', value: 300 },
  { name: 'Industrial', value: 300 },
  { name: 'Transportation', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function EnergyUsage() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}