import { createContext, useEffect, useState } from "react";

export const coinContext = createContext();

const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  //   const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&symbols=${currency.name}&category=layer-1&price_change_percentage=1h&include_tokens=all`;

  const fetchAllCoin = async () => {
    try {
      // 👇 Call your local backend instead of CoinGecko directly
      const response = await fetch(
        `http://localhost:5000/api/coins?currency=${currency.name}`
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched coins:", data);

      if (Array.isArray(data)) {
        setAllCoin(data);
      } else {
        console.error("Unexpected data format:", data);
        setAllCoin([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllCoin([]);
    }
  };

  useEffect(() => {
    fetchAllCoin();
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
  };
  return (
    <coinContext.Provider value={contextValue}>
      {props.children}
    </coinContext.Provider>
  );
};

export default CoinContextProvider;
