import React, { useEffect, useState } from 'react';

type Chain = 'ETH' | 'BASE';

const API_ENDPOINTS: Record<Chain, string> = {
    ETH: "https://eth.blockscout.com/api/v2/stats/charts/market",
    BASE: "https://base.blockscout.com/api/v2/stats/charts/market"
};

interface ChartData {
    date: string;
    closing_price: string;
    market_cap: string;
}

interface AnalyticsResponse {
    available_supply: string;
    chart_data: ChartData[];
}

const AnalyticsPage: React.FC = () => {
    const [selectedChain, setSelectedChain] = useState<Chain>('ETH'); 
    const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalyticsData = async (chain: Chain) => {
        const endpoint = API_ENDPOINTS[chain];
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Network response was not ok');
            const data: AnalyticsResponse = await response.json();
            console.log("Fetched data:", data);
            return data;
        } catch (error) {
            console.error("API call failed:", error);
            setError(error instanceof Error ? error.message : 'An error occurred');
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // Reset error state
            const data = await fetchAnalyticsData(selectedChain);
            setAnalyticsData(data);
            setLoading(false);
        };

        fetchData();
    }, [selectedChain]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Blockchain Analytics</h1>
            <select 
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value as Chain)} // Cast to Chain type
                className="mb-4 border rounded p-2"
            >
                <option value="ETH">Ethereum</option>
                <option value="BASE">Base</option>
                {/* Add more chains here */}
            </select>

            {loading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p className="text-red-500">Error fetching data: {error}</p>
            ) : (
                <div>
                    {analyticsData && (
                        <div>
                            <h2 className="text-xl">Market Data for {selectedChain}</h2>
                            <p>Available Supply: {analyticsData.available_supply}</p>
                            <table className="min-w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2">Date</th>
                                        <th className="border border-gray-300 p-2">Closing Price</th>
                                        <th className="border border-gray-300 p-2">Market Cap</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.chart_data.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 p-2">{item.date}</td>
                                            <td className="border border-gray-300 p-2">{item.closing_price}</td>
                                            <td className="border border-gray-300 p-2">{item.market_cap}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;
