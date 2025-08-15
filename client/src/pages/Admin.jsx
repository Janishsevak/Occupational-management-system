import React, { useState } from "react";
import CreatUser from "../components/admin/User/CreatUser";
import ChangePassword from "../components/admin/User/Changepassword";
import Ankleshwar from "../components/admin/Ankleshwar/Graph";
import Dahej from "../components/admin/Dahej/Dahej";
import Kurkumbh from "../components/admin/Kurkumbh/Kurkumbh";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { SlHome } from "react-icons/sl";
import { Menu, } from "antd";
import { BsKey } from "react-icons/bs";
import Graph from "../components/admin/Ankleshwar/Graph";
import Injuryrecord from "../components/admin/Ankleshwar/Injuryrecord";
import Oclmedical from "../components/admin/Ankleshwar/Oclmedical";
import FTEmedical from "../components/admin/Ankleshwar/FTEmedical";
import DailyOPD from "../components/admin/Ankleshwar/DailyOPD";


const items = [
  {
    key: "sub1",
    label: "User Management",
    icon: <FaUserPlus className="-ml-5 size-4.5" />,
    children: [
      { key: "16", label: "CreateUser" },
      { key: "17", label: "ChangePassword" },
      
    ],
  },

  {
    key: "sub2",
    label: "Ankleshwar",
    icon: <SlHome className="-ml-5 size-4.5" />,
    children: [
      { key: "1", label: "Graph" },
      { key: "2", label: "Injury" },
      { key: "3", label: "Ocl-Medical" },
      { key: "4", label: "FTE-Medical" },
      { key: "5", label: "Daily OPD" },
    ],
  },
  {
    key: "sub3",
    label: "Dahej",
    icon: <SlHome className="-ml-5 size-4.5" />,
    children: [
      { key: "6", label: "Graph" },
      { key: "7", label: "Injury" },
      { key: "8", label: "Ocl-Medical" },
      { key: "9", label: "FTE-Medical" },
      { key: "10", label: "Daily OPD" },
    ],
  },
  {
    key: "sub4",
    label: "Kurkumbh",
    icon: <SlHome className="-ml-5 size-4.5" />,
    children: [
      { key: "11", label: "Graph" },
      { key: "12", label: "Injury" },
      { key: "13", label: "Ocl-Medical" },
      { key: "14", label: "FTE-Medical" },
      { key: "15", label: "Daily OPD" },
    ],
  },
];

function Admin() {
  const [activeComponent, setActiveComponent] = useState("2"); // Default to CreateUser
  const navigate = useNavigate();
  const onClick = (e) => {
    console.log("click ", e);
    setActiveComponent(e.key);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "16":
        return <CreatUser />;
      case "17":
        return <ChangePassword />;
      case "1":
        return <Graph />;
      case "2":
        return <Injuryrecord />;
      case "3":
        return <Oclmedical />;
      case "4":
        return <FTEmedical />;
      case "5":
        return <DailyOPD/>;
      // case "dahej":
      //   return <Dahej />;
      // case "kurkumbh":
      //   return <Kurkumbh />;
      default:
        return null;
    }
  };

  const logouthandler = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
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
        <h1 className=" pl-10 font-semibold text-2xl text-blue-500 p-2 ">
          Admin Login
        </h1>
        <div className="p-2 h-[88%] bg-gray-50  flex flex-col">
          <ul className="space-y-4 ml-4">
            {/* <div>
              <li
                className={`hover:bg-gray-300 hover:text-black cursor-pointer px-2 py-2 rounded text-lg ${
                  activeComponent === "createuser"
                    ? "bg-gray-300 text-black "
                    : ""
                }`}
                onClick={() => setActiveComponent("createuser")}
              >
                <FaUserPlus className="inline-block mr-2" />
                Create user
              </li>
            </div> */}
            {/* <div>
              <li
                className={`hover:bg-gray-300 hover:text-black cursor-pointer px-2 py-2 rounded text-lg ${
                  activeComponent === "changepassword"
                    ? "bg-gray-300 text-black"
                    : ""
                }`}
                onClick={() => setActiveComponent("changepassword")}
              >
                <BsKey className="inline-block mr-2" />
                Change Password
              </li>
            </div> */}
            {/* <div>
              <li
              className={`hover:bg-gray-300 hover:text-black cursor-pointer px-2 py-2 rounded text-lg ${activeComponent === "ankleshwar" ? "bg-gray-300 text-black" : ""}`}
              onClick={() => setActiveComponent("ankleshwar")}
              >
                <SlHome  className="inline-block mr-2" />
              Ankleshwar
             </li>
            </div> */}
            <div className="w-full"> 
              <Menu
              onClick={onClick} 
              items={items}
              style={{
                width: 305,
                fontSize: "1.125rem", // same as Tailwind text-lg
                lineHeight: "4rem", // match Change Password height
                backgroundColor: "#f3f4f6", // Tailwind gray-50    
                hover: {
                  backgroundColor: "#d1d5db"},
                   marginLeft: "0rem",

              }}  
              defaultOpenKeys={["sub1"]}
              selectedKeys={[activeComponent]}
              mode="inline"
             
              />
            </div>
            {/* <div>
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
             </div> */}
          </ul>
          <div className="flex justify-center mt-auto gap-1">
            <button
              onClick={logouthandler}
              className=" bg-red-300 hover:bg-red-400 hover:cursor-pointer flex items-center justify-center  rounded-lg px-3 py-2 font-bold w-60 gap-2 "
            >
              <MdLogout className="text-3xl" />
              Logout
            </button>
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
