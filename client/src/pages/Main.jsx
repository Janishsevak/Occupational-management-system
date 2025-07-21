import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { Profilecontext } from "../context/Profilecontext";
import { ImCancelCircle } from "react-icons/im";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function Main() {
  const { userprofile } = useContext(Profilecontext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [showSlider, setShowSlider] = useState(false);
  const [FormData,setformdata] = useState({
           username : "",
           oldpassword:"",
           newpassword:"",
           confirmpassword:""
  });

  const logouthandler = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("origin");
    toast.success("Logged out successfully");
    navigate("/");
  };
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
        const response = await axios.post("http://localhost:8000/api/v1/users/changepassword",
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
                navigate("/login");  }
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
    <div className="h-screen w-screen bg-photo "> {/**/}
      <div className=" relative flex flex-col items-end mr-10">
        <CgProfile
          className="text-4xl hover:cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        <p>{userprofile?.username}</p>
      </div>
      {/*dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 top-10 w-44 bg-white rounded-lg shadow-md z-20 flex flex-col">
          <button
            onClick={() => {
              setDropdownOpen(false);
              setShowSlider(true); // or navigate('/changepassword')
            }}
            className="w-full text-left px-4 py-3 hover:bg-gray-200 hover:cursor-pointer border-b-2"
          >
            Changepassword
          </button>
          <button
            onClick={logouthandler}
            className="w-full text-left px-4 py-3 hover:bg-gray-200 hover:cursor-pointer border-b-2"
          >
            Logout
          </button>
        </div>
      )}
      {/* showslider */}
      {showSlider && (
        <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transition-transform duration-300">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <button
              onClick={() => setShowSlider(false)}
              className="text-xl font-bold hover:cursor-pointer"
            >
              <ImCancelCircle />
            </button>
          </div>
          <form className="p-4 space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full border rounded px-3 py-2"
              value={FormData.username}
              onChange={(e) =>
                setformdata({ ...FormData, username: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Old Password"
              className="w-full border rounded px-3 py-2"
              value={FormData.oldpassword}
              onChange={(e) =>
                setformdata({ ...FormData, oldpassword: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded px-3 py-2"
              value={FormData.newpassword}
              onChange={(e) =>
                setformdata({ ...FormData, newpassword: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Confirm Password"
              className="w-full border rounded px-3 py-2"
              value={FormData.confirmpassword}
              onChange={(e) =>
                setformdata({ ...FormData, confirmpassword: e.target.value })
              }
            />
            {FormData.newpassword !== FormData.confirmpassword &&
              FormData.confirmpassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            <button
              type="submit"
              onClick={SubmitEvent}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer"
            >
              Change Password
            </button>
          </form>
        </div>
      )}

      <h1 className="text-4xl text-center pt-20">Choose the Module</h1>
      <div className="flex justify-center items-center gap-10">
        <Link
          to="/oclpage"
          className="w-80 text-2xl font-semibold px-20 py-10 mt-20 bg-blue-300 rounded-lg hover:bg-blue-500 cursor-pointer"
        >
          OCL Medical{" "}
        </Link>
        <Link
          to="/ftepage"
          className="w-80 text-2xl font-semibold px-20 py-10 mt-20 bg-amber-300 rounded-lg hover:bg-amber-500 cursor-pointer"
        >
          FTE Medical{" "}
        </Link>
      </div>

      <div className="flex justify-center items-center gap-10">
        <Link
          to="/injury"
          className="w-80 text-2xl font-semibold px-20 py-10 mt-20 bg-blue-300 rounded-lg hover:bg-blue-500 cursor-pointer"
        >
          Injury Report{" "}
        </Link>
        <Link
          to="/daily"
          className="w-80 text-2xl font-semibold px-20 py-10 mt-20 bg-amber-300 rounded-lg hover:bg-amber-500 cursor-pointer"
        >
          Daily Medical{" "}
        </Link>
      </div>
    </div>
  );
}

export default Main;
