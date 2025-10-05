import React, { useContext, useEffect, useState } from "react";

import SearchIcon from "../../assets/search-icon.svg";

import "./home.style.scss";
import { coinContext } from "../../context/Coincontext";

const Home = () => {
  const { allCoin, currency } = useContext(coinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");

  const inputHandler = (e) => {
    setInput(e.target.value);
    if (e.target.value === "") {
      setDisplayCoin(allCoin);
    }
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    const coins = await allCoin.filter((coin) => {
      return coin.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div className="home">
      <div className="hero">
        <h1>
          Decentralized<span>Finance (DeFi) Market</span>{" "}
        </h1>
        <p>
          Explore the DeFi Market, where innovation meets opportunity. Buy,
          trade, and stake digital assets with full control and zero middlemen.
        </p>
        <form onSubmit={searchHandler}>
          <input
            type="text"
            value={input}
            onChange={inputHandler}
            placeholder="search crypto.."
            required
          />
          <button type="submit">
            <img src={SearchIcon} alt="" />
          </button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="crypto-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{ textAlign: "center" }}>24H Change</p>
          <p className="market-cap">Market cap</p>
        </div>
        {displayCoin.slice(0, 10).map((coin, index) => {
          return (
            <div className="crypto-layout" key={index}>
              <p>{coin.market_cap_rank}</p>
              <div>
                <img src={coin.image} alt="" />
                <p>{coin.name + " - " + coin.symbol}</p>
              </div>
              <p>
                {currency.symbol} {coin.current_price.toLocaleString()}
              </p>
              <p
                className={
                  coin.price_change_percentage_24h > 0 ? "green" : "red"
                }
              >
                {Math.floor(coin.price_change_percentage_24h * 100) / 100}
              </p>
              <p className="market-cap">
                {currency.symbol}
                {coin.market_cap.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
