import React from "react";

import "./custom-button.style.scss";

const CustomButton = ({
  children,
  signWithGoogle,
  signIn,
  signUp,
  ...otherProps
}) => {
  return (
    <div className="custom-btn">
      <button
        className={`${signWithGoogle ? "signWithGoogle" : ""} ${
          signIn ? "signIn" : ""
        } ${signUp ? "signUp" : ""} btn`}
        {...otherProps}
      >
        {children}
      </button>
    </div>
  );
};

export default CustomButton;
