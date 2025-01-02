import React from "react";

const Profile = ({userInfo,onLogout}) => {
    const getini=(name)=>{
        if(!name) return "";
        const word=name.split(" ");
        let ini="";
        for(let i =0;i<Math.min(word.length,2);i++){
            ini+=word[i][0];
        }
        return ini.toUpperCase();
    }
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
       {userInfo ? getini(userInfo.fullname):"?"}
      </div>
      <div className="flex flex-col items-start">
        <p className="text-sm font-medium">{userInfo ? userInfo.fullname:"G"}</p>
        <button className="text-sm font-medium text-blue-500 hover:underline" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;