// src/components/AutoCurrencySetter.jsx
import { useEffect, useContext } from "react";
import { CurrencyContext } from "./CurrencyContext";
import { useAuth } from "./AuthContext"; // assuming you have this context

const AutoCurrencySetter = () => {
  const { changeCurrency } = useContext(CurrencyContext);
  const { user } = useAuth(); // Your user object, if available

  useEffect(() => {
    // If the user is logged in and has a country defined, use that
    if (user && user.country) {
      if (user.country.toUpperCase() === "JP") {
        changeCurrency("JPY");
      } else {
        changeCurrency("LKR");
      }
    } else {
      // Otherwise, detect via IP
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          // For example, if country_code is "JP", set to JPY; else, LKR
          if (
            data &&
            data.country_code &&
            data.country_code.toUpperCase() === "JP"
          ) {
            changeCurrency("JPY");
          } else {
            changeCurrency("LKR");
          }
        })
        .catch((error) => {
          console.error("Error fetching geolocation data:", error);
          // Fallback currency
          changeCurrency("LKR");
        });
    }
  }, [user, changeCurrency]);

  // This component doesn't render any visible UI.
  return null;
};

export default AutoCurrencySetter;
