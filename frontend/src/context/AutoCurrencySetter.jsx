// src/components/AutoCurrencySetter.jsx
import { useEffect, useContext } from "react";
import { CurrencyContext } from "./CurrencyContext";
import { useAuth } from "./AuthContext";

const AutoCurrencySetter = () => {
  const { changeCurrency } = useContext(CurrencyContext);
  const { user } = useAuth();

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        // If logged-in user has country
        if (user && user.country) {
          if (user.country.toUpperCase() === "JP") {
            changeCurrency("JPY");
          } else {
            changeCurrency("LKR");
          }
          return;
        }

        // Otherwise call YOUR backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/geo`
        );

        const data = await res.json();

        if (data?.country_code?.toUpperCase() === "JP") {
          changeCurrency("JPY");
        } else {
          changeCurrency("LKR");
        }
      } catch (error) {
        console.error("Geo detection failed:", error);
        changeCurrency("LKR");
      }
    };

    detectCurrency();
  }, [user, changeCurrency]);

  return null;
};

export default AutoCurrencySetter;