import React, { useState } from "react";
import Navbar from "../components/navbar";
import Password from "../inputs/password";
import { Link, useNavigate } from "react-router-dom";
import axiosinstance from "../inputs/axiosinstance";
const Signup=()=>{
    const [name,setname]=useState("");
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");
    const [error,seterror]=useState(null);
    const validateEmail = (email) => {
      const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regx.test(email);
    };
   const navigate=useNavigate();
  const handleSignup=async(e)=>{
    e.preventDefault();
    if(!name){
      seterror("Please enter your name");
      return;
    }
    if(!validateEmail(email)){
      seterror("Please enter valid email address");
      return;
    }
    if(!password){
      seterror("Please enter the password");
      return;
    }
    seterror("")
    try{
      const response=await axiosinstance.post("/create-account",{
        fullname:name,
       email:email,
       password:password,
      })
      if(response.data && response.data.error){
      seterror(response.data.message)
      return;
      }
   if(response.data && response.data.accesstoken){
    localStorage.setItem("token",response.data.accesstoken)
    navigate('/dashboard');
   }

   }catch(error){
   if(error.response && error.response.data && error.response.data.message){
     seterror(error.response.data.message);
   }else{
     seterror("An unexpected error occured.Please try again");
   }
   }
  };
    return(
        <>
        <Navbar />
         <div className="flex items-center justify-center mt-28">
           <div className="w-96 border rounded bg-white px-7 py-10">
             <form onSubmit={handleSignup}>
               <h4 className="text-2xl mb-7">SignUp</h4>
              
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
     <Password
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Password"
            />
             {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}
            <button type="submit" className="btn-primary">
             Create Account
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
               login
              </Link>
            </p>

</form></div>
</div>
         </>  
    )
}
export default Signup;