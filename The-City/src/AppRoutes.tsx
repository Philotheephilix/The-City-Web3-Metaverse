// src/routes/index.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BaseLayout from './components/layouts/BaseLayout';
import Login from './pages/login';
import Dashboard from './pages/temp/dashboard';
import ToDo from './test/ToDo'
const AppRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <BaseLayout location={location}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/todo" element={<ToDo />} />
      </Routes>
    </BaseLayout>
  );
};

export default AppRoutes;
