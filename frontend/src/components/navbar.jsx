import React, { useState } from "react";
import Profile from "../inputs/profile";
import { useNavigate } from "react-router-dom";
import Search from "../inputs/search";

const Navbar = ({ userInfo, onSearchNote,handleclearsearch }) => {
  const [searchq, setsearchq] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    console.log("Searching for:", searchq);  // Debugging log
    if (searchq) {
      onSearchNote(searchq);
    }
  };

  const onClearSearch = () => {
    setsearchq("");
    handleclearsearch();
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow-md border-b w-full">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <Search 
        value={searchq}
        onChange={({ target }) => {
          setsearchq(target.value);  // Ensure this works
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <Profile userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
