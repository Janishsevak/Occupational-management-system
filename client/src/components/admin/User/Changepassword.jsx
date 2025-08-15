import axios from 'axios';
import React, { useState } from 'react'
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const navigate = useNavigate();
  const [FormData,setformdata] = useState({
    username : "",
    oldpassword:"",
    newpassword:"",
    confirmpassword:""
    })


  const SubmitEvent = async (e) =>{
    e.preventDefault();
    const user = {
      username:FormData.username,
      oldpassword:FormData.oldpassword,
      newpassword:FormData.newpassword,
      confirmedpassword:FormData.confirmpassword
    }
    console.log(user)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/changepassword`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        );
        if (response.status === 200) {
          console.log("Password changed suceessfully");
          toast.success("Password has been changed successfully");
          }}

     catch (error) {
            if (
              error.response &&
              error.response.data &&
              error.response.data.error &&
              error.response.data.error.name === "TokenExpiredError"
            ) {
              toast.error("Session expired. Please login again.");
              console.error("error while changed password",error)
              toast.error("Something is wrong")
              navigate("/");  }
            else if (error.response && error.response.data && error.response.data.message) {
                // Show backend error message in toast
                    toast.error(error.response.data.message);}
            else{
              toast.error("internal server error or try to relogin")
            } }
          setformdata({
           username : "",
           oldpassword:"",
           newpassword:"",
           confirmpassword:""
  })
}  
  return (
    
    <div className='mt-3 h-[80%] bg-white w-[98%]'>
      <h1 className='text-center text-3xl'>Change Password</h1>
      <form onSubmit={SubmitEvent} className=' mx-auto pt-13 mt-5 space-y-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] h-[75%] w-[60%]'>
        <div className='flex justify-center space-x-3 items-center'>
          <label className='text-xl w-44'>Username <span className="text-red-500">*</span> </label>
          <input
          type='text'
          required
          value = {FormData.username}
          onChange={(e)=>{
            setformdata({...FormData,username:e.target.value})
          }}
          className='text-lg shadow-3xl px-5 py-2 rounded-lg  border-2'
          placeholder='Enter Username'
          />
        </div>
        <div className='flex justify-center space-x-3 items-center'>
          <label className='text-xl w-44'>Oldpasswprd <span className="text-red-500">*</span> </label>
          <input
          type='text'
          required
          value = {FormData.oldpassword}
          onChange={(e)=>{
            setformdata({...FormData,oldpassword:e.target.value})
          }}
          className='text-lg shadow-3xl px-5 py-2 rounded-lg  border-2'
          placeholder='Enter oldpasswprd'
          />
        </div>
        <div className='flex justify-center  space-x-3 items-center'>
          <label className='text-xl w-44'>New Password <span className="text-red-500">*</span> </label>
          <input
          
          type='password'
          required
          value = {FormData.newpassword}
          onChange={(e)=>{
            setformdata({...FormData,newpassword:e.target.value})
          }}
          className='text-lg shadow-3xl px-5 py-2 rounded-lg  border-2'
          placeholder='Enter Newpassword'
          />
        </div>
        <div className='flex justify-center  space-x-3 items-center'>
          <label className='text-xl w-44'>Confirm Password <span className="text-red-500">*</span> </label>
          <input
          
          type='text'
          required
          value = {FormData.confirmpassword}
          onChange={(e)=>{
            setformdata({...FormData,confirmpassword:e.target.value})
          }}
          className='text-lg shadow-3xl px-5 py-2 rounded-lg  border-2'
          placeholder='Enter Confirmpassword'
          />
          
        </div>
        {FormData.newpassword !== FormData.confirmpassword && FormData.confirmpassword &&  (
         <p className="text-red-500 text-center text-sm mt-2">Passwords do not match</p>)}
         <div className='flex justify-center'>
          <button className='w-85 bg-blue-400 rounded-lg px-6 py-3  text-xl hover:cursor-pointer hover:bg-blue-700 '> Change Password </button>
         </div>
      </form>
    </div>
  )
}

export default ChangePassword
