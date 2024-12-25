import React, { useState } from "react";
import Navbar from "../components/navbar";
import { Link,useNavigate } from "react-router-dom";
import Password from "../inputs/password";
import axiosinstance from "../inputs/axiosinstance.jsx";

const Login = () => {
  // State to store form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
 const navigate=useNavigate();
  // Email validation function
  const validateEmail = (email) => {
    const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regx.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password cannot be empty.");
      return;
    }
  try{
     const response=await axiosinstance.post("/login",{
      email:email,
      password:password,
     })
     if(response.data && response.data.accesstoken){
      localStorage.setItem("token",response.data.accesstoken)
      navigate('/dashboard');
     }
  }catch(error){
  if(error.response && error.response.data && error.response.data.message){
    setError(error.response.data.message);
  }else{
    setError("An unexpected error occured.Please try again");
  }
  }
    // Simulate form submission (you can integrate API calls here)
    console.log("Email:", email, "Password:", password);
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSubmit}>
            <h4 className="text-2xl mb-7">Login</h4>
            {/* Error Message */}
           

            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
             {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}
 
            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
