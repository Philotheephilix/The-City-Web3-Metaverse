import { MapPin } from 'lucide-react'

export default function TrafficMap() {
  return (
    <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <MapPin className="h-12 w-12 text-red-500 animate-pulse" />
      </div>
      <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-75 p-2 rounded">
        <p className="text-xs text-white">Live Traffic Data</p>
      </div>
    </div>
  )
}