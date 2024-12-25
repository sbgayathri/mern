const express = require('express');
const cors = require('cors');
// const db = require('./db'); // If not used, you can leave this commented
const User = require('./models/usermodel.js');
const Note=require('./models/notemodel.js');
const config = require('./config.json');  // Using require for config.json
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authenticatetoken = require('./utilities.js');

require('dotenv').config();
mongoose.connect(config.connectionString);
const app = express();

app.use(express.json());
app.use(cors());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//account
app.post("/create-account", async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname) {
        return res.status(400)
            .json({ error: true, message: "Full Name is required" });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    try {
        const isUser = await User.findOne({ email: email });
        if (isUser) {
            return res.status(409).json({
                error: true, message: "User already exists"
            });
        }

        const user = new User({
            fullname,
            email,
            password,
        });
        await user.save();

        const accesstoken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            user,
            accesstoken,
            message: "Registration successful",
        });
    } catch (error) {
        console.error("Error creating user", error);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});
//login
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    if(!email){
        return res.status(400).json({message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({message:"Password is required"});
    }
    const userInfo=await User.findOne({email:email});
    if(!userInfo){
        return res.status(400).json({message:"User not found"});
    }
    if(userInfo.email==email && userInfo.password==password){
        const user={user:userInfo};
        const accesstoken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"36000m",
        })
        return res.json({
            error:false,
            message:"Login Successful",
          email,
          accesstoken,
        });
    }else{
        return res.status(400).json({
            error:true,
            message:"Invalid Credentials",
        })
    }
})
//getuser
app.get("/get-user",authenticatetoken,async(req,res)=>{
    const userId=req.user._id;
    const isUser=await User.findOne({_id:userId});
    if(!isUser){
        return res.sendStatus(401);
    }
    return res.json({
        user:{fullname:isUser.fullname,email:isUser.email,"_id":isUser._id,createdOn:isUser.createdOn},
        message:"",
    })
})
//notes
app.post("/add-notes",authenticatetoken,async(req,res)=>{
    const {title,content,tags}=req.body;
    //const {user}=req.user;
  if(!title){
    return res.status(400).json({error:true,message:"Title is required"});
  }
  if(!content){
    return res.status(400).json({error:true,message:"Content is required"});
  }
  try{
    const note=new Note({
        title,
        content,
        tags:tags||[],
        userId:req.user._id,
    });
    await note.save();
    
    return res.json({
        error:false,
        note,
        message:"Note added successfully",
    })
  }
  catch(error){
    return res.status(500).json({
        error:true,
        message:"Internal Server Error",
    })
  }
})
//edit
app.put("/edit-note/:noteId",authenticatetoken,async(req,res)=>{
    const noteId=req.params.noteId;
    const {title,content,tags,isPinned}=req.body;
    const userId=req.user._id;
    if(!title && !content && !tags){
        return res.status(400).json({error:true,message:"No changes provided"});
    }
    try{
        const note=await Note.findOne({_id:noteId,userId});
        if(!note){
            return res.status(404).json({error:true,message:"Note not found"});
        }
        if(title) note.title=title;
        if(content) note.content=content;
        if(tags) note.tags=tags;
        if(isPinned) note.isPinned=isPinned;
        await note.save();
        return res.json({
            error:false,
            note,
            message:"Note updated successfully",
        })
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server error",
        })
    }

})
//getnotes
app.get("/get-notes",authenticatetoken,async(req,res)=>{
    const userId=req.user._id;
    try{
        const notes=await Note.find({userId}).sort({isPinned:-1});
        return res.json({
            error:false,
            notes,
            message:"All notes retrieved successfull",
        })
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        })
    }
})
//deletenote
app.delete("/delete-note/:noteId",authenticatetoken,async (req,res)=>{
    const noteId=req.params.noteId;
    const userId=req.user._id;
    try{
        const note=await Note.findOne({_id:noteId,userId});
        if(!note){
            return res.status(404).json({erro:true,message:"Note not found"});
        }
        await Note.deleteOne({_id:noteId,userId});
        return res.json({
            error:false,
            messgae:"Note deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Intenal Server error"
        })
    }

})
//changeispinned
app.put("/update-ispinned/:noteId",authenticatetoken,async(req,res)=>{
    const noteId=req.params.noteId;
    const userId=req.user._id;
    const {isPinned}=req.body;
    
    try{
        const note=await Note.findOne({_id:noteId,userId});
        if(!note){
            return res.status(404).json({error:true,message:"Note not found"});
        }
        note.isPinned=isPinned;
        await note.save();
        return res.json({
            error:false,
            note,
            message:"Note updated successfully"
        })
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"
        })
    }
})
app.get("/search-notes",authenticatetoken,async(req,res)=>{
    const userId=req.user._id;
    const {query}=req.query;
    if(!query){
        return res.status(400)
        .json({error:true,message:"Search query is requires"});
    }
    try{
        const matchnotes=await Note.find({
            userId,
            $or:[
                {title:{$regex:new RegExp(query,"i")}},
                {content:{$regex:new RegExp(query,"i")}},
            ],
        });
        return res.json({
            error:false,
            notes:matchnotes,
            message:"Notes matching the search query retrieved successfully",
        })
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"
        })
    }
})
app.get("/test", (req, res) => {
    res.json("jcbjhshfvcbvvvvv");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
