import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const alerts = [
  { id: 1, title: 'Traffic Accident', description: 'Major intersection blocked on Main St.' },
  { id: 2, title: 'Weather Warning', description: 'Severe thunderstorm expected this evening.' },
  { id: 3, title: 'Public Event', description: 'City festival starting in Central Park at 2 PM.' },
]

export default function SafetyAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}