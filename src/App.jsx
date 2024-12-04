import React, { useEffect, useState } from "react";
import currencyData from "./currency.json";
import LineGraph from "./LineGraph";
import image from "./assets/convert.png";

const App = () => {
  const [countryName, setCountryName] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [convertCurrency, setConvertCurrency] = useState("");
  const [fetchedData, setFetchedData] = useState({});
  const [conversionrate, setConversionrate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [graphData, setGraphData] = useState([]);
  const [flag, setFlag] = useState("");

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        const ipAddress = data.ip;

        try {
          const response = await fetch(
            `http://api.ipstack.com/${ipAddress}?access_key=${import.meta.env.VITE_IPSTACK_API_KEY}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result = await response.json();
          setCountryName(result.country_name);
          setFlag(result.location.country_flag);

          const currency = currencyData.currencies.find(
            (item) => item.country === result.country_name
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

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };
  const handleSecondCurrencyChange = (event) => {
    setConvertCurrency(event.target.value);
  };

  useEffect(() => {
    const currencyConversion = async () => {
      if (convertCurrency === "" || selectedCurrency === "") return;
      try {
        const response = await fetch(
          `https://api.exchangeratesapi.io/v1/latest?access_key=${import.meta.env.VITE_EXCHANGE_RATE_API_KEY}&symbols=${selectedCurrency},${convertCurrency}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const rate =
          result.rates[convertCurrency] / result.rates[selectedCurrency];
        setConversionrate(rate);
      } catch (error) {
        console.error("Error fetching conversion data:", error.message);
      }

      function getLastSixMonthsSameDay() {
        const today = new Date();
        const dayOfMonth = today.getDate();
        const dates = [];

        for (let i = 0; i < 12; i++) {
          const date = new Date(
            today.getFullYear(),
            today.getMonth() - i,
            dayOfMonth
          );
          if (date.getDate() !== dayOfMonth) {
            date.setDate(0);
          }
          const formattedDate = date.toISOString().split("T")[0];
          dates.push(formattedDate);
        }

        return dates.reverse();
      }

      const datesArray = getLastSixMonthsSameDay();
      let prices = [];

      for (const date of datesArray) {
        const response = await fetch(
          `https://api.exchangeratesapi.io/v1/${date}?access_key=${EXCHANGE_RATE_API_KEY}&symbols=${selectedCurrency},${convertCurrency}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const ratePrices =
          result.rates[convertCurrency] / result.rates[selectedCurrency];
        prices.push(ratePrices);
      }

      setGraphData(
        datesArray.map((date, index) => ({
          date,
          price: prices[index],
        }))
      );
    };

    currencyConversion();
  }, [selectedCurrency, convertCurrency]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
      <div className="text-center mb-6">
        <div className="flex">
        <h2 className="text-4xl font-bold">
          Your Country: {countryName || "Loading..."}
        </h2>
        {flag && (
          <img src={flag} className="w-12 h-10 mt-2" alt="Country Flag" />
        )}
        </div>
        <div className="text-sm text-gray-400 mt-2">
          (Live location fetched from{" "}
          <a
            href="https://ipstack.com/"
            className="underline text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            IPStack API
          </a>
          )
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex gap-4 justify-center mb-6">
          <select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencyData.currencies.map((currency, index) => (
              <option key={index} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </select>
          <select
            onChange={handleSecondCurrencyChange}
            className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select the currency</option>
            {currencyData.currencies.map((currency, index) => (
              <option key={index} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center mb-6">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 w-48 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="ml-4 text-xl font-semibold">{selectedCurrency}</div>
          <img src={image} className="w-8 h-8 mx-4" alt="Currency converter" />
          <div className="text-2xl font-bold">
            {(conversionrate * amount).toFixed(2)} {convertCurrency}
          </div>
        </div>

        <div className="text-lg text-gray-400 text-center mb-6">
          *1 {selectedCurrency} = {conversionrate.toFixed(4)} {convertCurrency}
        </div>

        <div className="text-center mt-6">
          <h1 className="text-xl font-semibold">Prices Over Time</h1>
          <LineGraph data={graphData} />
        </div>
      </div>
    </div>
  );
};

export default App;
