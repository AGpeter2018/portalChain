import React, { useContext } from "react";

import arrow_icon from "../../assets/arrow_icon.png";
import { FaRegUserCircle } from "react-icons/fa";

import "./navbar.style.scss";
import { coinContext } from "../../context/Coincontext";
import { Link } from "react-router-dom";
import { auth } from "../../firebase-utils";

const Navbar = ({ currentUser }) => {
  const { currency, setCurrency } = useContext(coinContext);

  const currencyHandler = (e) => {
    switch (e.target.value) {
      case "usd": {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
      case "eur": {
        setCurrency({ name: "eur", symbol: "€" });
        break;
      }
      case "inr": {
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      }
      default: {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
    }
  };
  return (
    <div className="navbar">
      <Link to="/">
        <h1 className="Logo">PortalChain</h1>
      </Link>
      <ul>
        <li>Home</li>
        <li>Features</li>
        <li>Pricing</li>
        <li>Blog</li>
      </ul>
      <div className="nav-right">
        <select value={currency.name} onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>
        {currentUser ? (
          <p style={{ cursor: "pointer" }} onClick={() => auth.signOut()}>
            Sign Out
          </p>
        ) : (
          <Link to="/signIn">
            Sign In <img src={arrow_icon} alt="" />
          </Link>
        )}
        {currentUser && currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="profile image"
            style={{ width: "25px", height: "25px", borderRadius: "15px" }}
          />
        ) : (
          <FaRegUserCircle style={{ width: "20px", height: "25px" }} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
