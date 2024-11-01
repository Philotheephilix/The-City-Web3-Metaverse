import React from 'react';
import Header from '../common/Header';
interface BaseLayoutProps {
  children: React.ReactNode;
  location: { pathname: string };
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {

  return (
    <div className="min-h-screen ">
      <main className="  ">
        <Header/>
        {children}
      </main>
    </div>
  );
};

export default BaseLayout;