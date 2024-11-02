import React, { useEffect, useState } from 'react';
import CurrencyDashboard from '../../utils/quicknode/CurrencyDashboard';
import { getForex } from '@/utils/quicknode/Forex';
import { DashboardProps } from "../../utils/quicknode/Types";

const ExchangeRate: React.FC = () => {
  const [data, setData] = useState<DashboardProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getForex();
        setData(result);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="text-center">No data available</div>; 
  }
  return (
    <div className="  flex items-center justify-center  w-full" >
      <CurrencyDashboard
              rates={data.rates}
              fetchedAt={data.fetchedAt} fetched_at={data.fetchedAt}      />


    </div>
  );
};

export default ExchangeRate;
