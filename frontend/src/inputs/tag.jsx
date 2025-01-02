import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const Tag = ({ tags = [], settag }) => { // Updated prop to 'tags'
  const [inputva, setinputva] = useState("");

  const handleinput = (e) => {
    setinputva(e.target.value);
  };

  const addnewtag = () => {
    if (inputva.trim() !== "") {
      settag([...tags, inputva.trim()]); // Add new tag
      setinputva(""); // Reset input field
    }
  };

  const handlekeydown = (e) => {
    if (e.key === "Enter") {
      addnewtag();
    }
  };

  const deleteTag = (index) => {
    settag(tags.filter((_, i) => i !== index)); // Remove tag
  };

  return (
    <div>
      
      {/* Display Tags */}
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded"
            >
              #{tag}
              <button
                onClick={() => deleteTag(index)}
                className="text-gray-600 hover:text-red-600"
              >
                <MdClose className="cursor-pointer" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field and Add Button */}
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none w-40"
          placeholder="Add tags"
          value={inputva}
          onChange={handleinput}
          onKeyDown={handlekeydown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
          onClick={addnewtag}
        >
          <MdAdd className="text-white text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Tag;
