import React from 'react';

import { DashboardProps } from "./Types"

const CurrencyDashboard: React.FC<DashboardProps> = ({ rates, fetchedAt }) => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-black rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-300">Currency Rates Dashboard</h1>
      <div className="flex flex-wrap justify-around mt-4">
        {Object.entries(rates).map(([currency, rate]) => (
          <div className="bg-gray-800 rounded-lg p-4 m-2 flex flex-col items-center shadow-md w-1/4" key={currency}>
            <h2 className="text-xl text-blue-400">{currency}</h2>
            <p className="text-lg text-gray-300">{rate}</p>
          </div>
        ))}
      </div>
      <footer className="mt-6 text-center text-gray-300">
        <p>Data fetched at: {new Date(fetchedAt).toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default CurrencyDashboard;
