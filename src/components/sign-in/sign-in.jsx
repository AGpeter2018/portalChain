import React, { useState } from "react";

import CustomInput from "../custom-input/custom-input";
import CustomButton from "../custom-button/custom-button";

import "./sign-in.style.scss";

const SignIn = () => {
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = signInData;
  const handleSubmit = (event) => {
    event.preventDefault();
    setSignInData({ email: "", password: "" });
  };
  const handleChange = (event) => {
    const { value, name } = event.target;
    setSignInData({ [name]: value });
  };
  return (
    <div className="sign-in">
      <div className="logo">
        <p>PortalChain</p>
      </div>
      <div className="sign-in-title">
        <h2>Login with your account</h2>
      </div>
      <div className="login-form">
        <form className="sign-in-form" onSubmit={handleSubmit}>
          <div className="inputA">
            <CustomInput
              type="text"
              name="email"
              value={email}
              label="Email"
              handleChange={handleChange}
              required
            />
          </div>
          <div className="inputB">
            <CustomInput
              type="password"
              name="password"
              value={password}
              label="Password"
              handleChange={handleChange}
              required
            />
          </div>

          <CustomButton type="submit">Sign In</CustomButton>
          <CustomButton type="submit" signWithGoogle>
            Google
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
