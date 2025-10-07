import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, createUserProfile } from "../../firebase-utils";

import CustomButton from "../custom-button/custom-button";
import CustomInput from "../custom-input/custom-input";

import "./sign-up.style.scss";

const SignUp = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { displayName, email, password, confirmPassword } = userData;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Password not match" });
      setTimeout(() => setMessage({ type: "", text: "" }), 2500);
      return;
    }
    try {
      setLoading(true);
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      setLoading(false)

      await createUserProfile(user, { displayName });
      setMessage({ type: "success", text: "Account created successfully" });
      setTimeout(async () => {
        await auth.signOut();
        console.log("in already");
        navigate("/signIn");
      }, 2500);
      navigate("/signIn", {
        state: { message: "Account created successfully" },
      });
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2500);
      setUserData({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="sign-up">
      <div className="logo">
        <p>PortalChain</p>
      </div>
      <div className="sign-in-title">
        <h2>Sign up Today</h2>
      </div>
      <div className="form-body">
        <form action="" className="signUp-block" onSubmit={handleSubmit}>
          <CustomInput
            type="text"
            name="displayName"
            value={displayName}
            label="Display Name"
            handleChange={handleChange}
            required
          />
          <CustomInput
            type="email"
            name="email"
            value={email}
            label="Email"
            handleChange={handleChange}
            required
          />
          <CustomInput
            type="password"
            name="password"
            value={password}
            label="Password"
            handleChange={handleChange}
            required
          />
          <CustomInput
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            label="Confirm Password"
            handleChange={handleChange}
            required
          />
          <CustomButton signUp disabled={loading}>
            {loading ? "Creating..." : " CREATE USER"}
          </CustomButton>
        </form>
      </div>
      {message.text && (
        <div className={`alert ${message.type}`}>{message.text}</div>
      )}

      {loading && (
        <div className="spinner">
          <div className="spin"></div>
        </div>
      )}
      <div className="goTo-signIn">
        Already have an account ? <Link to="/signIn">sign In</Link>
      </div>
    </div>
  );
};

export default SignUp;
