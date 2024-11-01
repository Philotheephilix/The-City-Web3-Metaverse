"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

const API_KEY = "cqt_rQP7QrcrkRVPtVFc6vCPxcKYQBpk";
const NOVES_API_KEY = import.meta.env.VITE_NOVES_TRANSLATE_API_KEY;

// Define types for the fetched data
interface Transaction {
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}

interface AnalyticsItem {
  extends: {
    name: string;
    chain_id: number;
    category_label: string;
    label: string;
    logo_url?: string;
    color_theme?: {
      css_rgb?: string;
    };
    is_appchain?: boolean;
  };
  last_seen_at: number;
}

interface AnalyticsData {
  items: AnalyticsItem[];
}

interface TransactionDetails {
  type: string;
  description: string;
}

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const fetchCovalentData = async (walletAddress: string): Promise<AnalyticsData | null> => {
  const API_URL = `https://api.covalenthq.com/v1/eth-mainnet/address/${walletAddress}/transactions_v2/?key=${API_KEY}`;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    console.log("hiiiii",data)
    return data.data;
  } catch (error) {
    console.error("API call failed:", error);
    return null;
  }
};

const fetchTransactionHistory = async (address: string): Promise<Transaction[]> => {
  const options = {
    method: "GET",
    url: `https://translate.noves.fi/evm/eth/history/${address}`,
    headers: {
      accept: "application/json",
      apiKey: NOVES_API_KEY,
    },
  };
  try {
    const response = await axios.request(options);
    console.log(response)
    return response.data.items.slice(0, 15);
  } catch (error) {
    console.error("Failed to fetch transaction history:", error);
    return [];
  }
};

const fetchTransactionDetails = async (hash: string): Promise<TransactionDetails | null> => {
  const options = {
    method: "GET",
    url: `https://translate.noves.fi/evm/eth/describeTx/${hash}`,
    headers: {
      accept: "application/json",
      apiKey: NOVES_API_KEY,
    },
  };
  try {
    const response = await axios.request(options);
    console.log(response)

    return response.data;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return null;
  }
};

export default function CombinedAnalyticsPage() {
  const { address } = useParams<{ address: string }>();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<string | null>(null);
  const [txDetails, setTxDetails] = useState<TransactionDetails | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (address) {
        const covalentData = await fetchCovalentData(address);
        const txHistory = await fetchTransactionHistory(address);


        if (covalentData) {
          setAnalyticsData(covalentData); // Set analytics data
          setTransactions(txHistory); // Set transactions from items
        } else {
          console.error("Covalent data is null");
          setAnalyticsData(null);
        }
      } else {
        console.error("Address is undefined");
        setAnalyticsData(null);
        setTransactions([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [address]);
  

  const handleTxClick = async (hash: string) => {
    setSelectedTx(hash);
    setIsModalOpen(true);
    setModalLoading(true);
    setTxDetails(null);

    const details = await fetchTransactionDetails(hash);
    setTxDetails(details);
    setModalLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  if (!analyticsData && !transactions.length) return <div>Error loading data.</div>;

  return (
    <div className="container mx-auto p-4 space-y-6 bg-black text-white">
      {/* Address and Update Info */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-black">
          <div className="flex items-center justify-center gap-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Transaction History & Analytics</h1>
              <p className="mt-2 text-sm text-blue-600">Address: {address}</p>
            </div>
            <Button  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-800 transition-colors">
              NOVES
            </Button>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="">
          {transactions.length ? (
            <div className="overflow-x-auto bg-black">
              <table className="min-w-full divide-y divide-gray-200  bg-black border rounded-md">
                <thead className="bg-black text-center">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Hash
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Block Number
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gray-600">
                  {transactions.map((tx) => (
                    <tr key={tx.transactionHash} className="hover:bg-gray-800 text-center">
                      <td className="px-6 py-4 whitespace-nowrap ">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleTxClick(tx.transactionHash)}
                            className="text-blue-600 font-medium hover:underline"
                          >
                            {tx.transactionHash.slice(0, 10)}...{tx.transactionHash.slice(-8)}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tx.blockNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatTimestamp(tx.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-400">No transaction data available.</div>
          )}
        </div>
      </div>

      
      


      {/* Modal for Transaction Details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className=" rounded-lg bg-black max-w-md w-full p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Transaction Hash:</p>
              <p className="text-sm font-mono break-all mb-4">{selectedTx}</p>
              {modalLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : txDetails ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Type:</p>
                    <p className="font-medium">{txDetails.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description:</p>
                    <p className="font-medium">{txDetails.description}</p>
                  </div>
                </div>
              ) : (
                <p className="text-red-500">No details available for this transaction.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
