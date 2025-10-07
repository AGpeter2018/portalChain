import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, createUserProfile } from "../../firebase-utils";

import CustomButton from "../custom-button/custom-button";
import CustomInput from "../custom-input/custom-input";

import "./sign-up.style.scss";

const SignUp = () => {
  const navigate = useNavigate();
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
      alert("Please confirm password");
      return;
    }
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await createUserProfile(user, { displayName });
      await auth.signOut();
      navigate("/signIn");
      setUserData({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error.message);
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
      <div className="form-body">
        <form action="" className="signUp-block" onSubmit={handleSubmit}>
          <CustomInput
            type="text"
            name="displayName"
            value={displayName}
            label="displayName"
            onChange={handleChange}
            required
          />
          <CustomInput
            type="email"
            name="email"
            value={email}
            label="Email"
            onChange={handleChange}
            required
          />
          <CustomInput
            type="password"
            name="password"
            value={password}
            label="Password"
            onChange={handleChange}
            required
          />
          <CustomInput
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            label="Confirm Password"
            onChange={handleChange}
            required
          />
          <CustomButton signUp>CREATE USER</CustomButton>
        </form>
      </div>
      <div className="goTo-signIn">
        Already have an account ? <Link to="/signIn">sign In</Link>
      </div>
    </div>
  );
};

export default SignUp;
