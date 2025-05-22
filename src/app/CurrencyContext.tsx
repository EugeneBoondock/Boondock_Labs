"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

const CURRENCIES = [
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

interface CurrencyContextType {
  currency: string;
  setCurrency: (code: string) => void;
  rates: Record<string, number>;
  convert: (amount: number, toCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("ZAR");
  const [rates, setRates] = useState<Record<string, number>>({ ZAR: 1 });

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(
          `https://openexchangerates.org/api/latest.json?app_id=${process.env.NEXT_PUBLIC_OPENEXCHANGERATES_APP_ID}`
        );
        const data = await res.json();
        setRates(data.rates);
      } catch (e) {
        // fallback: only ZAR
        setRates({ ZAR: 1 });
      }
    }
    fetchRates();
  }, []);

  function convert(amount: number, toCurrency = currency) {
    if (toCurrency === "ZAR") return `R${amount.toLocaleString()}`;
    // Convert ZAR -> USD -> toCurrency
    const usd = amount / (rates["ZAR"] || 1);
    const converted = usd * (rates[toCurrency] || 1);
    return converted.toLocaleString(undefined, { style: 'currency', currency: toCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export { CURRENCIES }; 