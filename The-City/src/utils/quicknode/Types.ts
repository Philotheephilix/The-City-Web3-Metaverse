export interface CurrencyRates {
    INR: string;
    EUR: string;
    GBP: string;
    JPY: string;
    AUD: string;
    CAD: string;
    AED: string;
    HKD: string;
    MXN: string;
    TRY: string;
    ZAR: string;
  }
  
 export interface DashboardProps {
    fetched_at: string;
    rates: CurrencyRates;
    fetchedAt: string;
  }