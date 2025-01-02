import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const Search = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Notes"
        className="flex-grow text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
      />
      <IoMdClose
        className="text-slate-400 cursor-pointer hover:text-black ml-2"
        onClick={onClearSearch}
      />
      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black ml-2"
        onClick={handleSearch}
      />
    </div>
  );
};

export default Search;
