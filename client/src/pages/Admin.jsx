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
import { Menu } from "antd";
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
        return <DailyOPD />;
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
    <div className="relative h-screen w-full bg-white flex">
      {/* Sidebar */}
      <div className="w-[20%] h-screen bg-white flex flex-col">
        

        <h1 className="pl-6 font-semibold text-2xl text-blue-500 p-2">
          Admin Panel
        </h1>

        <div className="p-2 flex-1 bg-white flex flex-col">
          <Menu
            onClick={onClick}
            items={items}
            style={{
              width: "100%",
              fontSize: "1.125rem",
              lineHeight: "4rem",
              backgroundColor:"white",
            }}
            defaultOpenKeys={["sub1"]}
            selectedKeys={[activeComponent]}
            mode="inline"
          />
        </div>

        {/* Logout Button at bottom */}
        <div className="flex justify-center p-4">
          <button
            onClick={logouthandler}
            className="bg-red-300 hover:bg-red-400 flex items-center justify-center rounded-lg px-3 py-2 font-bold w-60 gap-2"
          >
            <MdLogout className="text-3xl" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div>
        
      </div>
      <div className="w-[80%] h-screen overflow-y-auto bg-gray-100">
        <div className="flex flex-col items-center py-2">
          <img
            className="w-40" // ✅ controlled width
            src="./photo/logo_alivus.webp"
            alt="Logo"
          />
        </div>
        {renderComponent()}
      </div>
    </div>
  );
}

export default Admin;
