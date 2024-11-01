"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { BarChart3, Droplets, Wind, Shield, Zap, DollarSign, PieChart, UserCog, Hospital, CreditCard, AlertCircle, FileText, Activity, TrendingUp, IndianRupeeIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"

import TrafficMap from './TrafficMap'
import UtilitiesGraph from './UtilitiesGraph'
import AirQualityHeatmap from './AirQualityHeatmap'
import SafetyAlerts from './SafetyAlerts'
import EnergyUsage from './EnergyUsage'
import FinancialModule from './FinancialModule'
import DataAnalytics from './DataAnalytics'
import axios from "axios";

interface Transaction {
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}
import CombinedAnalyticsPage from "../subpages/analytics"
const NOVES_API_KEY = import.meta.env.VITE_NOVES_TRANSLATE_API_KEY;
const fetchTransactionHistory = async (address: string): Promise<Transaction[]> => {
  const options = {
    method: "GET",
    url: `https://translate.noves.fi/evm/eth/history/${address}`,
    headers: {
      accept: "application/json",
      apiKey: NOVES_API_KEY,
    },
  };
  try {
    const response = await axios.request(options);
    return response.data.items.slice(0,5);
  } catch (error) {
    console.error("Failed to fetch transaction history:", error);
    return [];
  }
};

export default function Dashboard() {
  const [userRole, setUserRole] = useState('admin')
  const [, setIsLoggedIn] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate()
  
  useEffect(() => {
    const storedUser = localStorage.getItem('anonAadhaar');
    const user = storedUser ? JSON.parse(storedUser) : {};
    if (user && user.status === 'logged-in') {
      setIsLoggedIn(true);
      const userAddress = "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5";
      if (userAddress) {
        fetchTransactionHistory(userAddress).then(setTransactions);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);


  return (
    <div className={`flex flex-col h-screen dark`}>


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
             { icon: Hospital, label: 'Medical History', path: '/medical' },
             { icon: IndianRupeeIcon, label: 'Government Expenditure', path: '/public-expenditure' }
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
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest transaction activity.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CombinedAnalyticsPage addresss={localStorage.getItem('eth-add') || ''} />
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
const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};