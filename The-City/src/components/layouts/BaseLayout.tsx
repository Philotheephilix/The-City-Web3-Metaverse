import React from 'react';
interface BaseLayoutProps {
  children: React.ReactNode;
  location: { pathname: string };
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {

  return (
    <div className="min-h-screen ">
      <main className="  ">
        {children}
      </main>
    </div>
  );
};

export default BaseLayout;