"use client";
import { useCurrency, CURRENCIES as BASE_CURRENCIES } from "./CurrencyContext";
import React from "react";

// Extended currency list
const CURRENCIES = [
  ...BASE_CURRENCIES,
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "EGP", symbol: "ج.م", name: "Egyptian Pound" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "KES", symbol: "Ksh", name: "Kenyan Shilling" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
];

export default function CurrencyDropdown({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className={`relative ${className}`} style={{ minWidth: 120 }}>
      <select
        className={
          `glass-lighter border border-orange-200 text-[#3a2c1a] font-semibold px-2 py-1 text-sm rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#d17927] transition-all ` +
          `bg-[#e7dbc8]/80 hover:bg-[#f5e8d0] cursor-pointer w-full appearance-none`
        }
        value={currency}
        onChange={e => setCurrency(e.target.value)}
        aria-label="Select currency"
        style={{ maxHeight: 36, minWidth: 70 }}
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code} className="bg-[#e7dbc8] text-[#3a2c1a]">
            {c.code} {c.symbol}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#d17927] text-sm">
        ▼
      </span>
      {/* Scrollable dropdown for long lists (native select will show scroll) */}
    </div>
  );
} 