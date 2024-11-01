// src/routes/index.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BaseLayout from './components/layouts/BaseLayout';
import Login from './pages/login';
import Dashboard from './pages/temp/dashboard';
import MapPreview from './components/map/TrafficMap';
import CreativeMedicalRecordsPage from './pages/MedicalHistory' ;
import CrimesPage from './pages/temp/crimes';
import EnergyConsumptionPage from './pages/subpages/energy';
import PublicSafetyPage from './pages/subpages/publicsafety';
import AirQualityIndexPage from './pages/subpages/airquality';
import UtilitiesUsagePage from './pages/subpages/electricitywater';
import TrafficFlowPage from './pages/subpages/traffic';
import PYUSDTransfer from './utils/pyusd/transfer';
import UserBillsPage from './pages/payments';
import CombinedAnalyticsPage from './pages/subpages/analytics';
import AnalyticsPage from './pages/subpages/markets';
import ExpenditureVisual from './pages/Expenditure';
import CoinApiPage from './pages/temp/coinapi';
const AppRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <BaseLayout location={location}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/traffic-map-preview" element={<MapPreview/>}/>
        <Route path="/medical" element={<CreativeMedicalRecordsPage/>}/>
        <Route path="/crime" element={<CrimesPage/>}/>
        <Route path="/energy" element={<EnergyConsumptionPage/>}/>

        <Route path="/public-safety" element={<PublicSafetyPage/>}/>

        <Route path="/public-expenditure" element={<ExpenditureVisual/>}/>

        <Route path="/air" element={<AirQualityIndexPage/>}/>
        <Route path="/utilities" element={<UtilitiesUsagePage/>}/>
        <Route path="/traffic" element={<TrafficFlowPage/>}/>

        <Route path="/pay" element={<UserBillsPage/>}/>

        <Route path="/analytics/:address" element={<CombinedAnalyticsPage addresss={localStorage.getItem('eth-add') || ''}/>}/>
        <Route path="/analytic/:address" element={<AnalyticsPage/>}/>
        <Route path="/coinapi" element={<CoinApiPage/>}/>
        
        <Route path="/transfer" element={<PYUSDTransfer initialAmount='20'/>}/>

       </Routes>
    </BaseLayout>
  );
};

export default AppRoutes;
