import React, { createContext, useState, useEffect } from "react";

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("LKR"); // Default is LKR
  const [exchangeRate, setExchangeRate] = useState(1); // Default exchange rate for LKR

  useEffect(() => {
    console.log("Current currency:", currency); // Debugging
    console.log("Current exchange rate:", exchangeRate); // Debugging
  }, [currency, exchangeRate]);

  const changeCurrency = (newCurrency) => {
    if (newCurrency === "LKR") {
      setExchangeRate(1); // LKR stays the same
    } else if (newCurrency === "JPY") {
      setExchangeRate(0.35); // Example: JPY is 0.35 times LKR
    }
    setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, exchangeRate, changeCurrency }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
