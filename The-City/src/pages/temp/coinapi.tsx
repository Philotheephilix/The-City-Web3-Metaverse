import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = '92080a06-9fbe-42ff-9cfd-425bf6709458';
const ASSETS_ENDPOINT = 'https://rest.coinapi.io/v1/metrics/asset/current';

const METRICS_ENDPOINT = 'https://rest.coinapi.io/v1/metrics';

const DataFetcher: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      const response = await axios.get(ASSETS_ENDPOINT, {
        headers: { 'X-CoinAPI-Key': API_KEY },
      });
      setAssets(response.data);
    } catch (error) {
      setError('Error fetching assets: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(METRICS_ENDPOINT, {
        headers: { 'X-CoinAPI-Key': API_KEY },
      });
      setMetrics(response.data);
    } catch (error) {
      setError('Error fetching metrics: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAssets(), fetchMetrics()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2>Assets</h2>
      <ul>
        {assets.map(asset => (
          <li key={asset.asset_id}>
            {asset.asset_id} - {asset.name}
          </li>
        ))}
      </ul>

      <h2>Metrics</h2>
      <ul>
        {metrics.map(metric => (
          <li key={metric.metric_id}>
            {metric.metric_id} - {metric.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataFetcher;
