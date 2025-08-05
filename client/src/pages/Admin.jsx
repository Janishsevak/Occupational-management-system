import React, { useState } from "react";
import CreatUser from "../components/admin/CreatUser";
import ChangePassword from "../components/admin/Changepassword"
import Ankleshwar from "../components/admin/Ankleshwar"
import Dahej from "../components/admin/Dahej"
import Kurkumbh from "../components/admin/Kurkumbh";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { SlHome } from "react-icons/sl";

import { BsKey } from "react-icons/bs";


function Admin() {
  const [activeComponent, setActiveComponent] = useState("createuser");
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (activeComponent) {
      case "createuser":
        return <CreatUser />;
      case "changepassword":
        return <ChangePassword />;
      case "ankleshwar":
        return <Ankleshwar />;
      case "dahej":
        return <Dahej />;
      case "kurkumbh":
        return <Kurkumbh />;
      default:
        return null;
    }
  };
  const logouthandler = async () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/")
  }
  return (
    <div className=" relative h-screen w-full bg-white">
      <div>
        <img
          className="mx-auto pt-4 w-50 ml-220 "
          src="./photo/logo_alivus.webp"
          alt="Logo"
        />
      </div>
      <div className=" absolute w-[20%] top-0 h-screen bg-white">
        <h1 className=" pl-10 font-semibold text-2xl text-blue-500 p-2 ">Admin Login</h1>
        <div className="p-2 h-[88%] bg-gray-50  flex flex-col">
          <ul className="space-y-4 ml-4">
            <div>
              <li
              className={`hover:bg-gray-300 hover:text-black cursor-pointer px-2 py-2 rounded text-lg ${activeComponent === "createuser" ? "bg-gray-300 text-black " : ""}`}
              onClick={() => setActiveComponent("createuser")}
              >
                <FaUserPlus className="inline-block mr-2" />
              Create user
               </li>
            </div>
            <div>
              <li
              className={`hover:bg-gray-300 hover:text-black cursor-pointer px-2 py-2 rounded text-lg ${activeComponent === "changepassword" ? "bg-gray-300 text-black" : ""}`}
              onClick={() => setActiveComponent("changepassword")}
              >
                <BsKey className="inline-block mr-2" />
              Change Password
             </li>
            </div>
            <div>
              <li
              className={`hover:bg-gray-300 hover:text-black cursor-pointer px-2 py-2 rounded text-lg ${activeComponent === "ankleshwar" ? "bg-gray-300 text-black" : ""}`}
              onClick={() => setActiveComponent("ankleshwar")}
              >
                <SlHome  className="inline-block mr-2" />
              Ankleshwar
             </li>
            </div>
            <div>
              <li
              className={`hover:bg-gray-300 hover:text-black cursor-pointer px-2 py-2 rounded text-lg ${activeComponent === "dahej" ? "bg-gray-300 text-black" : ""}`}
              onClick={() => setActiveComponent("dahej")}
              >
                <SlHome  className="inline-block mr-2" />
              Dahej
            </li>
            </div>
             <div>
              <li
              className={`hover:bg-gray-300 hover:text-black cursor-pointer px-2 py-2 rounded text-lg ${activeComponent === "kurkumbh" ? "bg-gray-300 text-black" : ""}`}
              onClick={() => setActiveComponent("kurkumbh")}
              >
                <SlHome    className="inline-block mr-2" />
              Kurkumbh
              </li>
             </div>
          </ul>
          <div className="flex justify-center mt-auto gap-1">
            <button onClick={logouthandler} className=" bg-red-300 hover:bg-red-400 hover:cursor-pointer flex items-center justify-center  rounded-lg px-3 py-2 font-bold w-60 gap-2 ">
              <MdLogout className="text-3xl" />
              Logout</button>
        </div>
        </div>
      </div>
      <div className="absolute w-[80%] left-85 h-screen ">
         {renderComponent()}
      </div>
    </div>
  );
}

export default Admin;
