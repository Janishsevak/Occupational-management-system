import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CreatUser() {
  const [FormData, setformdata] = useState({
    name: "",
    username: "",
    password: "",
    confirmpassword: "",
    origin: "",
  });
  const [setuser] = useState({});
  const [data1, setdata1] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userdata = {
      name: FormData.name,
      username: FormData.username,
      password: FormData.password,
      confirmpassword: FormData.confirmpassword,
      origin: FormData.origin,
    };
    console.log(userdata)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/register`,
        userdata,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
              console.log("Created user suceessfully");
              toast.success("User created successfully");
              setRefresh(prev=>!prev);
    }} catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.name === "TokenExpiredError"
      ) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response && error.response.data && error.response.data.message) {
    // Show backend error message in toast
        toast.error(error.response.data.message);
      }else {
        toast.error("Admis can only create user");
      }
    }
    setuser(userdata);
    setformdata({
    name: "",
    username: "",
    password: "",
    confirmpassword: "",
    origin: "",
  })

  };
  const resetHandler = ()=>{
    setformdata({
    name: "",
    username: "",
    password: "",
    confirmpassword: "",
    origin: "",
  })
  setActiveIndex("");     
  }


  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/v1/admin/getuser", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setdata1(res.data.entries))
      .catch((error) => console.error("Error fetching data:", error));
      
  },[refresh]
);

  return (
    <div className=" mt-3 h-[80%] bg-white w-auto">
      
      <h1 className="text-center text-2xl p-3 bg-blue-50" >User Details</h1>
      <div className=" grid grid-cols-2 h-[80%]">
        <div className="bg-white p-4 ">
          <table className="ml-10 mt-5">
            <thead className="border-2">
              <tr>
                <th className="border border-gray-300 p-2 w-32">Sr.NO</th>
                <th className="border border-gray-300 p-2 w-32">Username</th>
                <th className="border border-gray-300 p-2 w-32">Origin</th>
              </tr>
            </thead>
            <tbody>
              {data1.map((data, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    setformdata({
                      name: data.name,
                      username: data.username,
                      origin: data.origin
                    })
                    setActiveIndex(index);
                  }}
                  className={activeIndex === index ? "bg-gray-300" : ""}
                > 

                  <td className="border border-gray-300 text-center p-2 cursor-pointer">
                    {index + 1}
                  </td>    
                  <td className="border border-gray-300 text-center p-2 cursor-pointer">
                    {data.username}
                  </td>
                  <td className="border border-gray-300 text-center p-2 cursor-pointer">
                    {data.origin}
                  </td>
                  </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-100 p-4 ml-35 mt-6 ">
          <form className="space-y-3" onSubmit={submitHandler}>
            <div className="flex items-center gap-4">
              <label className="w-32">Name</label>
              <input
                required
                type="text"
                value={FormData.name}
                onChange={(e) => {
                  setformdata({ ...FormData, name: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                placeholder="Enter Name Details"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32">Username</label>
              <input
                required
                type="text"
                value={FormData.username}
                onChange={(e) => {
                  setformdata({ ...FormData, username: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                placeholder="Enter UserName "
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32">Password</label>
              <input
                required
                type="password"
                value={FormData.password}
                onChange={(e) => {
                  setformdata({ ...FormData, password: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                placeholder="Enter Password"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32">ConfirmPassword</label>
              <input
                required
                type="text"
                value={FormData.confirmpassword}
                onChange={(e) => {
                  setformdata({ ...FormData, confirmpassword: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                placeholder="Enter Confirm Password"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32">Site</label>
              <select
                required
                value={FormData.origin}
                onChange={(e) => {
                  setformdata({ ...FormData, origin: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
              >
                <option value="">--Select Origin--</option>
                <option value="Ankleshwar">Ankleshwar</option>
                <option value="Dahej">Dahej</option>
                <option value="Kurkumbh">Kurkumbh</option>
              </select>
            </div>
            <div className="flex justify-center pt-5 space-x-4">
              <button
                type="submit"
                className="hover:cursor-pointer py-2 bg-blue-500 rounded-lg px-4 w-35  text-lg text-green-100 hover:bg-blue-700"
              >
                Create User
              </button>
              <button
                type="reset"
                onClick={resetHandler}
                className="hover:cursor-pointer py-2 bg-green-400 rounded-lg px-4 w-35 text-lg text-black hover:bg-green-700"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatUser;
