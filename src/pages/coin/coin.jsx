import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { coinContext } from "../../context/Coincontext";

import "./coin.style.scss";

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const { currency } = useContext(coinContext);

  const FetchCoinData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/coin/${coinId}?currency=${currency.name}`
      );
      if (!response.ok) throw new Error("Failed to fetch coin data");
      const data = await response.json();
      setCoinData(data);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };

  useEffect(() => {
    FetchCoinData();
  }, [currency]);

  if (coinData) {
    return (
      <div className="coin">
        <div className="coin-name">
          <img src={coinData.image.large} alt="" />
          <p>
            <b>
              {coinData.name} ({coinData.symbol.toUpperCase()})
            </b>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }
};

export default Coin;
