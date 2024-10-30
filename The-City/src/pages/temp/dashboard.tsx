"use client"

import { useState } from 'react'
import { Moon, Sun, BarChart3, Droplets, Wind, Shield, Zap, DollarSign, PieChart, UserCog, Menu } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TrafficMap from './TrafficMap'
import UtilitiesGraph from './UtilitiesGraph'
import AirQualityHeatmap from './AirQualityHeatmap'
import SafetyAlerts from './SafetyAlerts'
import EnergyUsage from './EnergyUsage'
import FinancialModule from './FinancialModule'
import DataAnalytics from './DataAnalytics'

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [userRole, setUserRole] = useState('admin')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    // Simulating login process
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    // Simulating logout process
    setIsLoggedIn(false)
  }

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CityVerse</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-gray-600 dark:text-gray-300"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-64 bg-gray-900 text-white p-4 hidden md:block">
          <ul className="space-y-2">
            {[
              { icon: BarChart3, label: 'Traffic' },
              { icon: Droplets, label: 'Utilities' },
              { icon: Wind, label: 'Air Quality' },
              { icon: Shield, label: 'Public Safety' },
              { icon: Zap, label: 'Energy Use' },
              { icon: DollarSign, label: 'Financial' },
              { icon: PieChart, label: 'Analytics' },
            ].map(({ icon: Icon, label }) => (
              <li key={label}>
                <Button variant="ghost" className="w-full justify-start">
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">User Role</span>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={userRole === 'admin'}
                  onCheckedChange={() => setUserRole(userRole === 'admin' ? 'user' : 'admin')}
                />
                <UserCog className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {userRole === 'admin' ? 'Admin Access' : 'User Access'}
            </p>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">City Overview</h2>
              
              {/* Dashboard Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Flow</CardTitle>
                    <CardDescription>Real-time city traffic map</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrafficMap />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Utilities Usage</CardTitle>
                    <CardDescription>Water and electricity consumption</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UtilitiesGraph />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Air Quality Index</CardTitle>
                    <CardDescription>City-wide air quality heatmap</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AirQualityHeatmap />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Public Safety</CardTitle>
                    <CardDescription>Recent alerts and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SafetyAlerts />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Energy Consumption</CardTitle>
                    <CardDescription>Real-time energy usage across the city</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EnergyUsage />
                  </CardContent>
                </Card>
              </div>

              {/* Financial Module */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>PYUSD transactions and gas fee calculations</CardDescription>
                </CardHeader>
                <CardContent>
                  <FinancialModule />
                </CardContent>
              </Card>

              {/* Data Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Predictive Analytics</CardTitle>
                  <CardDescription>Trend insights and optimization suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataAnalytics />
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}