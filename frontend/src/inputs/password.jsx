import React, { useState } from "react";

const Password = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  // Toggle password visibility
  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}  // Fixed typo here
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="text-sm text-blue-600 focus:outline-none"
      >
        {isShowPassword ? "Hide" : "Show"}  {/* Show/hide text */}
      </button>
    </div>
  );
};

export default Password;
