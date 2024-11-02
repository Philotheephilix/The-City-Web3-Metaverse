import { DashboardProps } from "./Types";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const data = {
  jsonrpc: "2.0",
  id: 1,
  method: "forex_getExchangeRate",
  params: ["USD", ["INR", "EUR", "GBP", "JPY", "AUD", "CAD","AED","HKD","MXN","TRY","ZAR"]],
};

export const getForex = async (): Promise<DashboardProps> => {  
  try {
    const response = await axios.post(
      "https://red-rough-layer.quiknode.pro/c87c920c69f13a451decc29eba290c728a454c1c",
      data,
      config
    );
    
    const rates = response.data.result.rates;
    const fetchedAt = response.data.result.fetched_at;

    return {
      rates: rates,
      fetchedAt: fetchedAt,
      fetched_at: '',
    };
  } catch (error) {
    console.error("Error fetching forex data:", error);
    throw error;
  }
};
