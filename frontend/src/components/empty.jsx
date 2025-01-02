import React from "react";
const Emptycard=({imgsrc,message})=>{
    return(
        <div className="flex flex-col items-center justify-center mt-20">
            <img src={imgsrc} alt="No notes" className="w-60"/>
            <p className="w-1/2 text-sm font-medium text-slate-700 text-center loading-7 mt-5">
            {message}</p>
        </div>
    )
}
export default Emptycard;