export interface CurrencyRates {
    INR: string;
    EUR: string;
    GBP: string;
    JPY: string;
    AUD: string;
    CAD: string;
  }
  
 export interface DashboardProps {
    fetched_at: string;
    rates: CurrencyRates;
    fetchedAt: string;
  }