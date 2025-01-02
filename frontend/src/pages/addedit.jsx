import React, { useState } from "react";
import Tag from "../inputs/tag";  // Make sure Tag component is imported
import { MdClose } from "react-icons/md";
import axiosinstance from "../inputs/axiosinstance";

const AddEdit = ({ notedata,type,getAllnotes,onClose,showtoastmessage}) => {
  const [title, setTitle] = useState(notedata?.title||"");
  const [content, setContent] = useState(notedata?.content||"");
  const [tags, setTags] = useState(notedata?.tags||[]);
  const [error,seterror]=useState(null);
  const addnewnote=async ()=>{
  try{
    const response=await axiosinstance.post("/add-notes",{
      title,
      content,
      tags,
    })
    if(response.data && response.data.note){
      showtoastmessage("Note Added successfully");
     getAllnotes();
     onClose();
    }
  }catch(error){
   if(error.response && error.response.data && error.response.data.message){
    seterror(error.response.data.message);
   }
  }


  };
  const editNote=async ()=>{
    const noteId=notedata._id;
    try{
      const response=await axiosinstance.put("/edit-note/"+noteId,{
        title,
        content,
        tags,
      })
      if(response.data && response.data.note){
        showtoastmessage("Note Updated successfully");
       getAllnotes();
       onClose();
      }
    }catch(error){
     if(error.response && error.response.data && error.response.data.message){
      seterror(error.response.data.message);
     }
    }

  };
  const handleaddnote=()=>{
    if(!title){
      seterror("Please enter the title");
      return;
    }
    if(!content){
      seterror("Please enter the content");
      return;
    }
    seterror("");
    if(type==='edit'){
      editNote()
    }else{
      addnewnote()
    }
  }
  return (
    <div className="relative">
      {/* Close Button */}
      <button
    className="w-10 h-10 rounded-full flex items-center justify-center absolute top-0 right-0 -mt-3 -mr-3 hover:bg-slate-50"
    onClick={onClose} // Trigger the passed onClose function to close the modal
  >
    <MdClose className="text-xl text-slate-400" />
  </button>

      {/* Content */}
      <div className="p-4 bg-white rounded shadow-md max-w-lg mx-auto">
        {/* TITLE Field */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-500 text-sm font-medium">TITLE</label>
          <input
            type="text"
            className="text-3xl font-semibold text-slate-950 outline-none"
            placeholder="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        {/* CONTENT Field */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-gray-500 text-sm font-medium">CONTENT</label>
          <textarea
            className="text-sm text-gray-600 outline-none bg-slate-100 p-3 rounded resize-none"
            placeholder="Content"
            rows={10}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          ></textarea>
        </div>

        {/* TAGS Field */}
        <div className="mt-4 flex flex-col gap-2">
          <label className="text-gray-500 text-sm font-medium">TAGS</label>
          <Tag tags={tags} settag={setTags} onClose={onClose} /> {/* Pass onClose to Tag */}
        </div>

        {error && <p className="text-red-500 text-xs py-4">{error}</p>}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 mt-5 rounded"
          onClick={handleaddnote}
        >
          {type=== "edit"?"UPDATE":"ADD"}
        </button>
      </div>
    </div>
  );
};

export default AddEdit;
