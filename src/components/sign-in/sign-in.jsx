import React, { useState } from "react";

import { auth, signInWithGoogle } from "../../firebase-utils";

import CustomInput from "../custom-input/custom-input";
import CustomButton from "../custom-button/custom-button";

import "./sign-in.style.scss";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = signInData;
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await auth.signInWithEmailAndPassword(email, password);
      setSignInData({ email: "", password: "" });
      setMessage({ type: "success", text: "Signed in successfully!" });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
        navigate("/");
      }, 4000);
    } catch (error) {
      console.log(error.message);
      setMessage({ type: "serror", text: error.message });
      setTimeout(() => setMessage({ type: "", text: "" }), 2500);
    } finally {
      setLoading(false);
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

          <CustomButton type="submit" signIn disabled={loading}>
            {loading ? "Signing In" : "Sign In"}
          </CustomButton>
          <CustomButton
            type="submit"
            signWithGoogle
            onClick={signInWithGoogle}
            disabled={loading}
          >
            Google
          </CustomButton>
        </form>
      </div>
      {message.text && (
        <div className={`alert ${message.type}`}>{message.text}</div>
      )}
      <div className="go-signUp">
        Not having an account ? <Link to="/signUp">sign up</Link>
      </div>
    </div>
  );
};

export default SignIn;
