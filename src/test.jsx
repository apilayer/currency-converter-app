import React, { useEffect, useState } from "react";
import currencyData from "./currency.json";

const App = () => {
  const [countryName, setCountryName] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [convertCurrency, setConvertCurrency] = useState("");
  const [fetchedData, setFetchedData] = useState({});
  const [conversionrate, setConversionrate] = useState(0.02);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Fetch the user's IP address
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        const ipAddress = data.ip;

        // Fetch location data based on IP address
        try {
          const response = await fetch(
            `http://api.ipstack.com/${ipAddress}?access_key=b10940cb537fc7f78c335c94b79ce748`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result = await response.json();
          const fetchedCountry = result.country_name;
          setCountryName(fetchedCountry);

          // Find the currency code for the fetched country and set it as the default selected currency
          const currency = currencyData.currencies.find(
            (item) => item.country === fetchedCountry
          );
          if (currency) {
            setSelectedCurrency(currency.code);
          }
        } catch (error) {
          console.error("Error fetching country data:", error.message);
        }
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIp();
  }, []);

  // Handle dropdown selection change
  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
    console.log(event.target.value);
  };
  const handleSecondCurrencyChange = (event) => {
    setConvertCurrency(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    const currencyConversion = async () => {
      if (convertCurrency === "" || selectedCurrency === "") return;
      try {
        const response = await fetch(
          `https://api.exchangeratesapi.io/v1/latest?access_key=6dbdedc1bf95daab6017275d7e2c74f4&symbols=${selectedCurrency},${convertCurrency}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        // setFetchedData(result);
        console.log(result);
        // console.log(result.rates.{selectedCurrency});
        const rate = (
          result.rates[convertCurrency] / result.rates[selectedCurrency]
        ).toFixed(2);
        // +`result.rates.${selectedCurrency}`;
        setConversionrate(rate);
        console.log(rate);
      } catch (error) {
        console.error("Error fetching country data:", error.message);
      }

      function getLastSixMonthsSameDay() {
        const today = new Date();
        const dayOfMonth = today.getDate(); // Get today's date (e.g., 24)
        const dates = [];

        for (let i = 0; i < 7; i++) {
          // Create a date for the same day in the previous months
          const date = new Date(
            today.getFullYear(),
            today.getMonth() - i,
            dayOfMonth
          );

          // Handle cases where the month has fewer days (e.g., February)
          if (date.getDate() !== dayOfMonth) {
            date.setDate(0); // Set to the last day of the previous month
          }

          const formattedDate = date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
          dates.push(formattedDate);
        }

        return dates.reverse(); // Reverse to get in chronological order
      }

      const datesArray = getLastSixMonthsSameDay();
      console.log(datesArray);

      let prices = [];

      datesArray.map(async (date) => {
        const response = await fetch(
          `https://api.exchangeratesapi.io/v1/${date}?access_key=6dbdedc1bf95daab6017275d7e2c74f4&symbols=${selectedCurrency},${convertCurrency}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const rate = (
          result.rates[convertCurrency] / result.rates[selectedCurrency]
        ).toFixed(2);
        prices.push(rate);
      });
      console.log(prices);
    };
    currencyConversion();
  }, [selectedCurrency, convertCurrency]);

  return (
    <div>
      <h2>Your Country: {countryName || "Loading..."}</h2>
      <select value={selectedCurrency} onChange={handleCurrencyChange}>
        {currencyData.currencies.map((currency, index) => (
          <option key={index} value={currency.code}>
            {currency.code}
          </option>
        ))}
      </select>
      <select onChange={handleSecondCurrencyChange}>
        <option> Select the currency </option>
        {currencyData.currencies.map((currency, index) => (
          <option key={index} value={currency.code}>
            {currency.code}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div>
        {" "}
        1 {selectedCurrency} = {conversionrate} {convertCurrency}
      </div>
      <div>
        {" "}
        {amount} {selectedCurrency} = {conversionrate * amount}{" "}
        {convertCurrency}
      </div>
    </div>
  );
};

export default App;
