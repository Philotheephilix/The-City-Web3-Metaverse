// src/routes/index.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BaseLayout from './components/layouts/BaseLayout';
import Login from './pages/login';
import Dashboard from './pages/temp/dashboard';
import ToDo from './test/ToDo'
import MapPreview from './components/map/TrafficMap';
import CreativeMedicalRecordsPage from './pages/MedicalHistory' ;
import CrimesPage from './pages/temp/crimes';
import EnergyConsumptionPage from './pages/subpages/energy';
import PublicSafetyPage from './pages/subpages/publicsafety';
import AirQualityIndexPage from './pages/subpages/airquality';
import UtilitiesUsagePage from './pages/subpages/electricitywater';
import TrafficFlowPage from './pages/subpages/traffic';
const AppRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <BaseLayout location={location}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/todo" element={<ToDo />} />
        <Route path="/traffic-map-preview" element={<MapPreview/>}/>
        <Route path="/medical" element={<CreativeMedicalRecordsPage/>}/>
        <Route path="/crime" element={<CrimesPage/>}/>
        <Route path="/energy" element={<EnergyConsumptionPage/>}/>

        <Route path="/public-safety" element={<PublicSafetyPage/>}/>

        <Route path="/air" element={<AirQualityIndexPage/>}/>
        <Route path="/utilities" element={<UtilitiesUsagePage/>}/>
        <Route path="/traffic" element={<TrafficFlowPage/>}/>


       </Routes>
    </BaseLayout>
  );
};

export default AppRoutes;
