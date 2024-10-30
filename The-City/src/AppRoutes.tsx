// src/routes/index.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BaseLayout from '../components/layouts/BaseLayout';
import Login from './pages/login';
import Home from './pages/Homepage'
const AppRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <BaseLayout location={location}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        
      </Routes>
    </BaseLayout>
  );
};

export default AppRoutes;
