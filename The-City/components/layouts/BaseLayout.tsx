import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
interface BaseLayoutProps {
  children: React.ReactNode;
  location: { pathname: string };
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, location }) => {
  const hideNavbarFooter = location.pathname === '/pages/Login';

  return (
    <div className="min-h-screen ">
      {!hideNavbarFooter && <Navbar />}
      <main className="  ">
        {children}
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

export default BaseLayout;