import React, { useState } from "react";

import { auth, signInWithGoogle } from "../../firebase-utils";

import CustomInput from "../custom-input/custom-input";
import CustomButton from "../custom-button/custom-button";

import "./sign-in.style.scss";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = signInData;
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setSignInData({ email: "", password: "" });
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleChange = (event) => {
    const { value, name } = event.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
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

          <CustomButton type="submit" signIn>
            Sign In
          </CustomButton>
          <CustomButton type="submit" signWithGoogle onClick={signInWithGoogle}>
            Google
          </CustomButton>
        </form>
      </div>
      <div className="go-signUp">
        Not having an account ? <Link to="/signUp">sign up</Link>
      </div>
    </div>
  );
};

export default SignIn;
