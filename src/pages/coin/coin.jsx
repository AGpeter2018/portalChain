import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { coinContext } from "../../context/Coincontext";

import "./coin.style.scss";
import LineChart from "../../components/line-chart/line-chart";

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historyData, setHistoryCoinData] = useState(null);
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

  const FetchHistoryData = async () => {
    const url = `http://localhost:5000/api/coin/${coinId}/history?currency=${currency.name}&days=10&interval=daily`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setHistoryCoinData(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    FetchCoinData();
    FetchHistoryData();
  }, [currency]);

  if (coinData && historyData) {
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
        <div className="coin-chart">
          <LineChart historyData={historyData} />
        </div>
        <div className="coin-info">
          <ul>
            <li>Crypto Market Rank</li>
            <li>{coinData.market_cap_rank}</li>
          </ul>
          <ul>
            <li>Current Price</li>
            <li>
              {currency.symbol}{" "}
              {coinData.market_data.current_price[
                currency.name
              ].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>Market cap</li>
            <li>
              {currency.symbol}
              {coinData.market_data.market_cap[currency.name].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>24 Hour high</li>
            <li>
              {currency.symbol}
              {coinData.market_data.high_24h[currency.name].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>24 Hour low</li>
            <li>
              {currency.symbol}
              {coinData.market_data.low_24h[currency.name].toLocaleString()}
            </li>
          </ul>
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
