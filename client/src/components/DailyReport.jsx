import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useNavigate } from "react-router-dom";

function OclReport() {
  const [ data1, setdata1 ] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [graphType, setGraphType] = useState("contractor");
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // const contractorCounts = data1.reduce((acc, curr) => {
  //   // Check if Designation is a string and not a number
  //   if (
  //     curr.contractorName &&
  //     curr.Designation &&
  //     isNaN(Number(curr.Designation))
  //   ) {
  //     acc[curr.contractorName] = (acc[curr.contractorName] || 0) + 1;
  //   }
  //   return acc;
  // }, {});

  // const contractorData = Object.entries(contractorCounts).map(
  //   ([name, count]) => ({
  //     name,
  //     count,
  //   })
  // );

  const categoryCounts = data1.reduce((acc, curr) => {
    const category = curr.category || curr.Category || "";
    if (category.toLowerCase().includes("fte")) {
      acc.FTE = (acc.FTE || 0) + 1;
    } else if (category.toLowerCase().includes("contract")) {
      acc.Contractor = (acc.Contractor || 0) + 1;
    }
    return acc;
  }, {});

  const employeeContractorData = [
    { name: "FTE", count: categoryCounts.FTE || 0 },
    { name: "Contractor", count: categoryCounts.Contractor || 0 },
  ];
  console.log("Employee vs Contractor Data:", employeeContractorData);

  const logouthandler = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("origin");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const monthwiseCounts = {};
  data1.forEach((item) => {
    if (!item.date) return;
    const month = new Date(item.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const key = `${item.contractorName} - ${month}`;
    monthwiseCounts[key] = (monthwiseCounts[key] || 0) + 1;
  });
  // const monthwiseData = Object.entries(monthwiseCounts).map(
  //   ([name, count]) => ({
  //     name,
  //     count,
  //   })
  // );

  const searchhandler = () => {
    if (searchTerm === "" || searchValue === "") {
      alert("Please select a search term and enter a value.");
      return;
    }
    const filteredData = data1.filter((item) => {
      if (searchTerm === "Contract") {
        return (
          item.category === "Contract" &&
          item.Designation &&
          item.Designation.toLowerCase().includes(searchValue.toLowerCase())
        );
      } else if (searchTerm === "Name") {
        return item.Name.toLowerCase().includes(searchValue.toLowerCase());
      } else if (searchTerm === "Date") {
        return item.date === searchValue;
      } else if (searchTerm === "Employee")
        return (
          item.category !== "Contract" &&
          item.Designation &&
          item.Designation.toString() === searchValue.toString()
        );
    });
    setdata1(filteredData);
  };
  const token = localStorage.getItem("token");
  const origin = localStorage.getItem("origin");
  const fetchData = async () => {
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/dailymedical/getdailymedicalentries`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-origin": origin,
          },
        }
      )
      .then((res) => setdata1(res.data.entries))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formdata = new FormData();
    formdata.append("file", file);
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      console.error("No token found");
      toast.error("No token found");
      return;
    }
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/dailymedical/uploaddailymedicalfile`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            "x-origin": origin,
          },
        }
      );
      console.log("File uploaded successfully");
      toast.success("File uploaded successfully");
      const res = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/dailymedical/getdailymedicalentries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setdata1(res.data.entries);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="h-full w-full flex-col justify-center">
      <h1 className="text-4xl text-center w-full p-2 bg-neutral-300">
        OPD Report
      </h1>
      <div className="w-full flex items-center mt-1">
        <div className="flex w-[70%] gap-2 mt-2">
          <select
            placeholder="Search by Name"
            className="border border-gray-300 rounded-lg p-2 ml-5 w-48 mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <option value="">--Select--</option>
            <option value="Contract">Contract-Name</option>
            <option value="Name">Name</option>
            <option value="Date">Date</option>
            <option value="Employee">Empolyee_Id</option>
          </select>
          <input
            className="border border-gray-300 rounded-lg p-2 w-48 mb-2"
            type={searchTerm === "Date" ? "date" : "text"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={
              searchTerm === "Date"
                ? "Select Date"
                : searchTerm === "Name"
                ? "Search Name"
                : searchTerm === "Contract"
                ? "Search Contractor"
                : searchTerm === "Employee"
                ? "Search Employee"
                : "Search"
            }
          />
          <button
            onClick={searchhandler}
            className="bg-blue-400 w-23 py-2 mb-2 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
          >
            Search
          </button>
          <button
            className="bg-orange-300 w-23  py-2 mb-2 rounded-lg hover:bg-orange-500 hover:cursor-pointer"
            onClick={() => fetchData()}
          >
            Clear
          </button>
        </div>
        <div className="flex w-[30%] justify-end items-center">
          <button
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg  ml-4 hover:bg-cyan-800 hover:cursor-pointer "
            onClick={() => setShowGraph(true)}
          >
            Graph Report
          </button>
          <button
            onClick={triggerFileInput}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg  ml-4 hover:bg-cyan-800 hover:cursor-pointer"
          >
            Upload Data
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden // hide actual input
          />
          <button
            onClick={logouthandler}
            className="bg-red-500 text-white px-4 py-2 rounded-lg ml-4 hover:bg-red-800 hover:cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="h-full w-full mt-2">
        <div className="ml-4">
          <table className="w-[90%] border-collapse border border-gray-300">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="border border-gray-300 py-2 w-30">Date</th>
                <th className="border border-gray-300 py-2 w-30">Name</th>
                <th className="border border-gray-300 py-2 w-30">Department</th>
                <th className="border border-gray-300 py-2 w-30 ">Category</th>
                <th className="border border-gray-300 py-2 w-30">
                  Designation
                </th>
                <th className="border border-gray-300 py-2 w-30">Age</th>
                <th className="border border-gray-300 py-2 w-30 ">Puropse</th>
                <th className="border border-gray-300 py-2 w-30">Treatment</th>
              </tr>
            </thead>
            <tbody>
              {data1.map((data, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                  }}
                  className={activeIndex === index ? "bg-gray-300" : ""}
                >
                  <td className="border border-gray-300 text-center p-2">
                    {data.date
                      ? new Date(data.date).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td className="border border-gray-300 text-center p-2">
                    {data.Name}
                  </td>
                  <td className="border border-gray-300 text-center p-2">
                    {data.Department}
                  </td>
                  <td className="border border-gray-300 text-center p-2">
                    {data.category}
                  </td>
                  <td className="border border-gray-300 text-center p-2">
                    {data.Designation}
                  </td>
                  <td className="border border-gray-300 text-center p-2">
                    {data.age}
                  </td>
                  <td className="border border-gray-300 text-center p-2">
                    {data.purpose}
                  </td>
                  <td className="border border-gray-300 text-center p-2">
                    {data.Treatment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-lg p-4 flex   items-center">
          <div className="flex items-center w-[50%]">
            <span className="mr-2">Total data: {data1.length}</span>
          </div>
          <div className="flex justify-center items-center gap-4">
            <button
              className={
                activeIndex !== null
                  ? "bg-red-400 text-black rounded-lg px-3 py-1.5 hover:bg-red-600 cursor-pointer"
                  : "hidden"
              }
            >
              Delete
            </button>
            <button
              className={
                activeIndex !== null
                  ? "bg-green-400 text-black rounded-lg px-5 py-1.5 hover:bg-green-600 cursor-pointer"
                  : "hidden"
              }
              onClick={() => {
                const selectedData = data1[activeIndex];
                if (selectedData) {
                  const {
                    _id,
                    date,
                    Name,
                    contractorName,
                    category,
                    Designation,
                    age,
                    purpose,
                    Treatment,
                  } = selectedData;
                  const formattedDate = new Date(date).toLocaleDateString(
                    "en-GB"
                  );
                  console.log(
                    `ID: ${_id}, Date: ${formattedDate}, Workmen Name: ${Name}, Contractor Name: ${contractorName}, Age: ${age}, category: ${category}, Designation : ${Designation}, purpose: ${purpose}, Treatment: ${Treatment}`
                  );
                }
              }}
            >
              Edit
            </button>
          </div>
        </nav>
        {/* Graph Modal */}
        {showGraph && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg h-[93%] w-[95%]">
              <h2 className="text-xl text-center font-bold mb-4">
                OPD Data Graph
              </h2>
              <div className="items-center flex justify-center mb-4 gap-3">
                {/* <button
                  className={
                    graphType === "contractor"
                      ? "w-65 text-black px-4 py-2 rounded-lg bg-blue-500"
                      : "w-70 text-black px-4 py-2 rounded-lg bg-gray-300"
                  }
                  onClick={() => setGraphType("contractor")}
                >
                  By Contractor
                </button> */}
                {/* <button
                  className={
                    graphType === "monthwise"
                      ? "w-65 text-black px-4 py-2 rounded-lg bg-blue-500"
                      : "w-70 text-black px-4 py-2 rounded-lg bg-gray-300"
                  }
                  onClick={() => setGraphType("monthwise")}
                >
                  Month-wise by Contractor
                </button> */}
                <button
                  className={
                    graphType === "employeeContractor"
                      ? "w-65 text-black px-4 py-2 rounded-lg bg-blue-500"
                      : "w-70 text-black px-4 py-2 rounded-lg bg-gray-300"
                  }
                  onClick={() => setGraphType("employeeContractor")}
                >
                  Employee vs Contractor
                </button>
              </div>
              <div className="h-[400px] w-full mt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    // width={20}
                    // height={300}
                    // graphType === "contractor"
                    //     ? contractorData
                    //     : graphType === "monthwise"
                    //     ? monthwiseData
                    //     :
                    data={
                       employeeContractorData
                    }
                    margin={{
                      top: 40,
                      right: 30,
                      left: 20,
                      bottom: 3,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Total Persons"
                      fill="#8884d8"
                      activeBar={<Rectangle fill="pink" stroke="blue" />}
                    >
                      <LabelList dataKey="count" position="top" />
                    </Bar>  
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <button
                className="-mt-10 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
                onClick={() => setShowGraph(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OclReport;
