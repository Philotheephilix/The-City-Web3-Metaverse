"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { BarChart3, Droplets, Wind, Shield, Zap, DollarSign, PieChart, Hospital, CreditCard, AlertCircle, FileText, Activity, TrendingUp, IndianRupeeIcon,MessageSquareHeart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FaArrowRightToBracket } from "react-icons/fa6";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { PiPaypalLogoBold } from "react-icons/pi";
import { FaEthereum } from "react-icons/fa";
import { FaPaypal } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

import QRCode from "react-qr-code";

import TrafficMap from './TrafficMap'
import UtilitiesGraph from './UtilitiesGraph'
import AirQualityHeatmap from './AirQualityHeatmap'
import SafetyAlerts from './SafetyAlerts'
import EnergyUsage from './EnergyUsage'
import DataAnalytics from './DataAnalytics'
import axios from "axios";
import {getGasFeesInEth} from '../../utils/quicknode/GasEstimation'
import ExchangeRate from "../subpages/Exchange"
interface Transaction {
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}
import CombinedAnalyticsPage from "../subpages/analytics"
import GasFeeDisplay from "@/components/GasFeeDisplay"
import CustomModal from "@/components/common/Modal"
import PYUSDTransfer from "@/utils/pyusd/transfer"
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
  const [, setIsLoggedIn] = useState(false)
  const [, setTransactions] = useState<Transaction[]>([]);
  const [gasFee, setGasFee] = useState<string>('0')
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchGasFee = async () => {
      try {
        const fee = await getGasFeesInEth()
        setGasFee(fee || '0')
      } catch (error) {
        console.error('Failed to fetch gas fee:', error)
        setGasFee('0')
      }
    }
    fetchGasFee()
    console.log(gasFee)
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState<boolean>(false);

  const closeReceiveModal = () => {
    setIsReceiveModalOpen(false);
  };
  return (
    <div className={`flex flex-col h-screen dark`}>


      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-64 bg-black text-white p-4 hidden md:block ">
          <ul className="space-y-2">
            {[
             { icon: BarChart3, label: 'Traffic', path: '/traffic' },
             { icon: Droplets, label: 'Utilities', path: '/utilities' },
             { icon: Wind, label: 'Air Quality', path: '/air' },
             { icon: Shield, label: 'Public Safety', path: '/public-safety' },
             { icon: Zap, label: 'Energy Use', path: '/energy' },
             { icon: DollarSign, label: 'Financial', path: '/finance/0x974CaA59e49682CdA0AD2bbe82983419A2ECC400' },
             { icon: PieChart, label: 'Analytics', path: '/analytic' },
             { icon: Hospital, label: 'Medical History', path: '/medical' },
             { icon: IndianRupeeIcon, label: 'Government Expenditure', path: '/public-expenditure' },
             { icon: MessageSquareHeart, label: 'Feedbacks', path: '/feedback' }

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
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-gray-900 dark:bg-gray-900 overflow-hidden">
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
                
                <Card onClick={() => navigate('utilities')}>
                  <CardHeader>
                    <CardTitle>Utilities Usage</CardTitle>
                    <CardDescription>Water and electricity consumption</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UtilitiesGraph />
                  </CardContent>
                </Card>
                <Card>
                <GasFeeDisplay gasFee={gasFee}/>
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
                      Accepted cards: PYUSD, EVM
                    </p>

                    {/* Payment Button */}
                    <Button className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                    </Button>
                  </CardContent>
                </Card>
                <Card >
                  <CardHeader>
                    <CardTitle className="text-xl">Transfer With <span className="text-red-500">Love ❤️</span></CardTitle>
                    <CardDescription>Transfer PYUSD within Seconds</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-8  h-full">
                    <div className="flex flex-row text-7xl gap-2 align-center justify-center w-full">
                      <FaEthereum className="text-green-400"/><FaArrowRightArrowLeft className="text-slate-400"/><FaPaypal className="text-blue-400"/>
                    </div>
                    <Button 
                      onClick={()=>{setIsModalOpen(true)}}
                      className="bg-blue-500 hover:bg-blue-800 transition-all"
                      >
                        SEND
                        <FaArrowRightToBracket />
                    </Button>
                     <Button
                      className="bg-green-500 hover:bg-green-800 transition-all"
                      onClick={()=>{setIsReceiveModalOpen(true)}}
                      >
                        RECEIVE
                        <BsBoxArrowInLeft />
                        </Button>
                      <Button className="w-[max-content] bg-transparent text-grey-500 hover:bg-transparent">
                        Powered By
                        <PiPaypalLogoBold />
                      </Button>
                  </CardContent>
                </Card>
                <CustomModal isOpen={isModalOpen} onRequestClose={closeModal}>
                  <PYUSDTransfer />
                </CustomModal>
                <CustomModal isOpen={isReceiveModalOpen} onRequestClose={closeReceiveModal} >
                  <QRCode className="p-8" value={localStorage.getItem('eth-add') || 'Invalid address'} />
                  <span className="text-white flex align-center w-full justify-center">Scan For PYUSD Address [EVM]</span>
                </CustomModal>
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
              <Card>
                <CardContent>
                  <ExchangeRate/>
                </CardContent>
              </Card>

              {/* Financial Module */}
              <Card>
                  
                  <CardContent>
                    <CombinedAnalyticsPage addresss={localStorage.getItem('eth-add') || '0x974CaA59e49682CdA0AD2bbe82983419A2ECC400'} />
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
