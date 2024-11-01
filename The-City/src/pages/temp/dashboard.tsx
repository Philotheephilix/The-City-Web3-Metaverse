"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { Moon, Sun, BarChart3, Droplets, Wind, Shield, Zap, DollarSign, PieChart, UserCog, Menu, Hospital, CreditCard, AlertCircle, FileText, Activity, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const [paymentAmount, setPaymentAmount] = useState('')
  const navigate = useNavigate()
  
  useEffect(() => {
    const storedUser = localStorage.getItem('anonAadhaar');
    const user = storedUser ? JSON.parse(storedUser) : {};
    if (user && user.status === 'logged-in') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = () => {
    navigate('/Login')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('anonAadhaar')
    setIsLoggedIn(false)
    navigate('/Login')
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CityVerse Dashboard</h1>
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
                      <AvatarFallback className="text-white">S</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{localStorage.getItem('username')}</p>
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
             { icon: BarChart3, label: 'Traffic', path: '/traffic' },
             { icon: Droplets, label: 'Utilities', path: '/utilities' },
             { icon: Wind, label: 'Air Quality', path: '/air' },
             { icon: Shield, label: 'Public Safety', path: '/public-safety' },
             { icon: Zap, label: 'Energy Use', path: '/energy' },
             { icon: DollarSign, label: 'Financial', path: '/financial' },
             { icon: PieChart, label: 'Analytics', path: '/analytics' },
             { icon: Hospital, label: 'Medical History', path: '/medical' }
           ].map(({ icon: Icon, label, path }) => (
             <li key={label}>
               <Button
                 variant="ghost"
                 className="w-full justify-start"
                 onClick={() => navigate(path)}
               >
                 <Icon className="mr-2 h-4 w-4" />
                 {label}
                </Button>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{localStorage.getItem('username')}</span>
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
                <Card onClick={() => navigate('traffic')}>
                  <CardHeader>
                    <CardTitle>Traffic Flow</CardTitle>
                    <CardDescription>Real-time city traffic map</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrafficMap />
                  </CardContent>
                </Card>
                
                <Card onClick={() => navigate('utilities')}>
                  <CardHeader>
                    <CardTitle>Utilities Usage</CardTitle>
                    <CardDescription>Water and electricity consumption</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UtilitiesGraph />
                  </CardContent>
                </Card>
                
                <Card onClick={() => navigate('air')}> 
                  <CardHeader>
                    <CardTitle>Air Quality Index</CardTitle>
                    <CardDescription>City-wide air quality heatmap</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AirQualityHeatmap />
                  </CardContent>
                </Card>
                
                <Card onClick={() => navigate('public-safety')}>
                  <CardHeader>
                    <CardTitle>Public Safety</CardTitle>
                    <CardDescription>Recent alerts and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SafetyAlerts />
                  </CardContent>
                </Card>
                
                <Card onClick={() => navigate('energy')}>
                  <CardHeader>
                    <CardTitle>Energy Consumption</CardTitle>
                    <CardDescription>Real-time energy usage across the city</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EnergyUsage />
                  </CardContent>
                </Card>

                {/* New Payment Card */}
                <Card onClick={() => navigate('pay')} className="p-4 space-y-4 shadow-md hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="text-xl font-bold text-center">Make a Payment</CardTitle>
    <CardDescription className="text-center">Pay your bills or fines securely</CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Decorative Icons or Graphics */}
    <div className="flex justify-center space-x-4 text-primary">
      <CreditCard className="w-10 h-10" />
      <Shield className="w-10 h-10" />
      <TrendingUp className="w-10 h-10" />
    </div>

    {/* Text or Additional Information */}
    <p className="text-sm text-center text-gray-600">
      Use secure payment methods with encryption and protection for all transactions. 
    </p>
    <p className="text-sm text-center text-gray-600">
      Accepted cards: Visa, Mastercard, Amex
    </p>

    {/* Payment Button */}
    <Button className="w-full">
      <CreditCard className="mr-2 h-4 w-4" /> Pay Now
    </Button>
  </CardContent>
</Card>

                {/* New Crimes Card */}
                <Card onClick={() => navigate('crime')}>
                  <CardHeader>
                    <CardTitle>Recent Crimes</CardTitle>
                    <CardDescription>Latest reported incidents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span className="flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                          Theft
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Downtown</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                          Vandalism
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Suburb</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />
                          Assault
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">City Center</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-4">
                      View All Crimes
                    </Button>
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
              <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Payment Analytics</CardTitle>
                <CardDescription>
                  Your payment activity over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Total Transactions
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last 30 days
                      </p>
                    </div>
                    <div className="ml-auto font-medium">1,234</div>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Average Payment
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last 30 days
                      </p>
                    </div>
                    <div className="ml-auto font-medium">$157.23</div>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Pending Payments
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Requires action
                      </p>
                    </div>
                    <div className="ml-auto font-medium">23</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}