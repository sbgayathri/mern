import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Card from "../components/card";
import { MdAdd } from "react-icons/md";
import Addedit from "./addedit";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../inputs/axiosinstance";
import Toast from "../components/toastmsg";
import Emptycard from "../components/empty";
import Emptyimg from "../images/emptynotes.jpg";
import nodata from "../images/nodata.jpeg";
const Home = () => {
  const [openemodal, setopenemodal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const closeModal = () => {
    setopenemodal({ isShown: false, type: "add", data: null });
  };
  const [showtoastmsg,setshowtoastmsg]=useState({
    isShown:false,
    message:"",
    type:"add",
  });
  const [allnotes,setallnotes]=useState([])
  const [userInfo,setuserInfo]=useState(null);
  const [isSearch,setisSearch]=useState(false);


  const navigate=useNavigate();
const handledit=(notedetails)=>{
  setopenemodal({isShown:true,data:notedetails,type:"edit"});
}
const showtoastmessage=(message,type)=>{
  setshowtoastmsg({
    isShown:true,
    message,
     type,

  })
}
const handleclosetoast=()=>{
  setshowtoastmsg({
    isShown:false,
    message:"",
  })
}
//user
  const  getuserInfo=async()=>{
   try{
    const response=await axiosinstance.get("/get-user");
    if(response.data && response.data.user){
      setuserInfo(response.data.user);
    }
   }catch(error){
    if(error.response.status===401){
      localStorage.clear();
      navigate("/login");
    }
   }
  }
  //getnote
  const getAllnotes=async()=>{
    try{
       const response=await axiosinstance.get("/get-notes");
       if(response.data && response.data.notes){
        setallnotes(response.data.notes);
       }
    }catch(error){
      console.log("An unexpected error occurred.Please try again");
    }
  }
//deletenote
 const deletenote=async(data)=>{
  const noteId=data._id;
  try{
    const response=await axiosinstance.delete("/delete-note/"+noteId);
    if(response.data && !response.data.error){
      showtoastmessage("Note Deleted successfully",'delete');
     getAllnotes();
    }
  }catch(error){
   if(error.response && error.response.data && error.response.data.message){
   console.log("An unexpected error occurred.Please try again");
   }
  }

 } 
const onSearchNote=async(query)=>{
  console.log("Searching notes with query:", query); 
  if (!query) {
    // Reset to show all notes if the search query is empty
    setisSearch(false);
    getAllnotes();
    return;
}
  try{
    const response=await axiosinstance.get("/search-notes",{
      params:{query},
    })
    if(response.data && response.data.notes){
      setisSearch(true);
      setallnotes(response.data.notes);
    }
  }catch(error){
    console.log(error);
  }
}
const updateispinned = async (notedata) => {
  const noteId = notedata._id;

  // Optimistically update state for immediate feedback
  const updatedNotes = allnotes.map((note) =>
    note._id === noteId ? { ...note, isPinned: !notedata.isPinned } : note
  ).sort((a, b) => b.isPinned - a.isPinned); // Ensure the notes are sorted with pinned ones first

  setallnotes(updatedNotes); // Update the state

  try {
    const response = await axiosinstance.put("/update-note/" + noteId, {
      isPinned: !notedata.isPinned,
    });
    if (response.data && response.data.note) {
      showtoastmessage("Note Updated successfully", "update");
      getAllnotes();
    }
  } catch (error) {
    console.log(error);
  }
};

const handleclearsearch=()=>{
  setisSearch(false);
  getAllnotes();
}
  useEffect(()=>{
    getAllnotes();
    getuserInfo();
    return ()=>{};
},[])

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleclearsearch={handleclearsearch}/>
      <div className="container mx-auto px-4 sm:px-8">
        {allnotes.length>0?(
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allnotes.map((item,index)=>(
             <Card
             key={item._id}
             title={item.title}
             date={item.createdOn}
             content={item.content}
             tags={item.tags}
             isPinned={item.isPinned}
             onEdit={() => handledit(item)}
             onDelete={() => deletenote(item)}
             onPinNote={() => updateispinned(item)}
           />
          ))}
          
          {/* Add more cards here as needed */}
        </div>
        ):(
        <Emptycard imgsrc={isSearch?nodata:Emptyimg} 
        message={isSearch?"Oops! No notes found matching your search":"Start creating your first note !  Click ths'ADD' button to jot down your thoughts,ideas and reminder .Let's get started"}
        />
        )
}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 fixed right-10 bottom-10 shadow-lg transition-all duration-300"
        onClick={() => {
          setopenemodal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openemodal.isShown}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Add/Edit Modal"
      >
        <Addedit 
        type={openemodal.type}
        notedata={openemodal.data}
        
        onClose={closeModal}
        getAllnotes={getAllnotes}
        showtoastmessage={showtoastmessage} /> {/* Pass onClose to AddEdit */}
      </Modal>
      <Toast
      isShown={showtoastmsg.isShown}
      message={showtoastmsg.message}
      type={showtoastmsg.type}
      onClose={handleclosetoast}
      />
    </>
  );
};

export default Home;
