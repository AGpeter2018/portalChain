import React from "react";

import logo from "../../logo.png";
import arrow_icon from "../../arrow_icon.png";

import "./navbar.style.css";

const Navbar = () => {
  return (
    <div className="navbar">
      {/* <img src={logo} alt="" /> */}
      <h1 className="Logo">PortalChain</h1>
      <ul>
        <li>Home</li>
        <li>Features</li>
        <li>Pricing</li>
        <li>Blog</li>
      </ul>
      <div className="nav-right">
        <select>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>
        <button>
          Sign Up <img src={arrow_icon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
