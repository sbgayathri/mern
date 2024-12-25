import React, { useState } from "react";
import Profile from "../inputs/profile";
import { useNavigate } from "react-router-dom";
import Search from "../inputs/search";

const Navbar = ({userInfo,onsearchnote}) => {
  const [searchq,setsearchq]=useState("");
  const navigate = useNavigate(); // Corrected here

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleSearch=()=>{
  
  }
  const onClearSearch=()=>{
    setsearchq("");
    
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow-md border-b w-full">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <Search 
      value={searchq}
      onChange={({target})=>{
        setsearchq.apply(target.value);
      }}
      
      onClearSearch={onClearSearch}/>
      <Profile userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
