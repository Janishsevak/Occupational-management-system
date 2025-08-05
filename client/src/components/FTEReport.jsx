import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
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

function FTEReport() {
  const [data1, setdata1] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [employeeYearlyData, setEmployeeYearlyData] = useState([]);
  const [bpData, setBpData] = useState([]);
  const [sugarData, setSugarData] = useState([]);
  const [cholesterolData, setCholesterolData] = useState([]);
  //   const [graphType, setGraphType] = useState("contractor");
  const [graphType, setGraphType] = useState("");
  const navigate = useNavigate();

  const origin = localStorage.getItem("origin");

  const processGraphData = (data1) => {
    const employeeYearlyData = {};
    const bpData = [];
    const sugarData = [];
    const cholesterolData = [];

    data1.forEach((item) => {
      // ---- 1. Count by Year ----
      const year = new Date(item.date).getFullYear();
      if (!employeeYearlyData[year]) {
        employeeYearlyData[year] = 0;
      }
      employeeYearlyData[year]++;

      // ---- 2. BP, Sugar, Cholesterol per person (for simple graph) ----
      if (item.bp) {
        bpData.push({ name: item.name || "Unknown", count: Number(item.bp) });
      }

      if (item.sugar) {
        sugarData.push({
          name: item.name || "Unknown",
          count: Number(item.sugar),
        });
      }

      if (item.cholesterol) {
        cholesterolData.push({
          name: item.name || "Unknown",
          count: Number(item.cholesterol),
        });
      }
    });

    // Format employeeYearlyData into array
    const employeeYearlyArray = Object.entries(employeeYearlyData).map(
      ([year, count]) => ({
        name: year,
        count,
      })
    );

    return {
      employeeYearlyData: employeeYearlyArray,
      bpData,
      sugarData,
      cholesterolData,
    };
  };

  const fileInputRef = useRef(null);
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  const searchhandler = () => {
    if (searchTerm === "" || searchValue === "") {
      alert("Please select a search term and enter a value.");
      return;
    }
    const filteredData = data1.filter((item) => {
      if (searchTerm === "Employee") {
        return item.EmployeeID.toString().includes(searchValue);
      }
      return item[searchTerm]
        ? item[searchTerm]
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        : false;
    });
    setdata1(filteredData);
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    await axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/FTEmedical/ftemedicaldata`,
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

  const logouthandler = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("origin");
    toast.success("Logged out successfully");
    navigate("/");
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
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (data1.length > 0) {
      const { employeeYearlyData, bpData, sugarData, cholesterolData } =
        processGraphData(data1);
      setEmployeeYearlyData(employeeYearlyData);
      setBpData(bpData);
      setSugarData(sugarData);
      setCholesterolData(cholesterolData);
    }
  }, [data1]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formdata = new FormData();
    formdata.append("file", file);
    const token = localStorage.getItem("token");
    const origin = localStorage.getItem("origin");
    console.log("Token:", token);
    if (!token) {
      console.error("No token found");
      toast.error("No token found");
      return;
    }
    if (!origin) {
      toast.error("No origin found");
      return;
    }

    try {
      await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/FTEmedical/uploadFTEmedicaldata`,
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/FTEmedical/ftemedicaldata`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-origin": origin,
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
        Employee Medical Report
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
            {/* <option value="Contract">Contract-Name</option> */}
            <option value="Name">Name</option>
            {/* <option value="Date">Date</option> */}
            <option value="Employee">Empolyee_Id</option>
          </select>
          <input
            className="border border-gray-300 rounded-lg p-2 w-48 mb-2"
            type={searchTerm === "Date" ? "date" : "text"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={
              // searchTerm === "Date"
              //   ? "Select Date"
              //   : searchTerm === "Name"
              //   ? "Search Name"
              //   : searchTerm === "Contract"
              //   ? "Search Contractor"
              //   : searchTerm === "Employee"
              //   ? "Search Employee"
              //   : "Search"
              searchTerm === "Name"
                ? "Search Name"
                : searchTerm === "Employee"
                ? "Search by Employee_ID"
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
          {/* <button
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg  ml-4 hover:bg-cyan-800"
            onClick={() => setShowGraph(true)}
          >
            Graph Report
          </button> */}
          <button
            onClick={triggerFileInput}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg  ml-4 hover:bg-cyan-800 hover:cursor-pointer  "
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
            className="bg-red-500 text-white px-4 py-2 rounded-lg  ml-4 hover:bg-red-800 hover:cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="h-full w-full mt-2 pb-20">
        <div className="ml-4 ">
          <table className="w-[90%] border-collapse border border-gray-300">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="w-[300px] items-center">Sr.No</th>
                <th className="w-[300px] items-center">Date</th>
                <th className="w-[300px] items-center">Name</th>
                <th className="w-[300px] items-center">EmployeeID</th>
                <th className="w-[300px] items-center">Department</th>
                <th className="w-[300px] items-center">DOJ</th>
                <th className="w-[300px] items-center">DOB</th>
                <th className="w-[300px] items-center">Desingation</th>
                <th className="w-[300px] items-center">Height</th>
                <th className="w-[300px] items-center">Weight</th>
                <th className="w-[300px] items-center">BP</th>
                <th className="w-[300px] items-center">Cholstrol</th>
                <th className="w-[300px] items-center">Sugar</th>
                <th className="w-[300px] items-center">Hb</th>
                <th className="w-[300px] items-center">Remarks</th>
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
                  <td className="border border-gray-300 p-2 w-30">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.date
                      ? new Date(data.date).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.Name}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.EmployeeID}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.Department}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.DOJ
                      ? new Date(data.DOJ).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.DOB
                      ? new Date(data.DOB).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.Desingation}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.height ? parseFloat(data.height).toFixed(1) : ""}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.weight ? parseFloat(data.weight).toFixed(1) : ""}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">{data.BP}</td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.cholstrol}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.sugar}
                  </td>
                  <td className="border border-gray-300 p-2 w-30">{data.Hb}</td>
                  <td className="border border-gray-300 p-2 w-30">
                    {data.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-lg p-4 flex items-center z-50">
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
            <div className="bg-white p-6 rounded shadow-lg h-[93%] w-[95%] overflow-y-auto">
              <h2 className="text-xl text-center font-bold mb-4">
                Employee Medical Graphs
              </h2>

              {/* Buttons for each graph */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  className={`px-4 py-2 rounded-lg ${
                    graphType === "employeeYearly"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setGraphType("employeeYearly")}
                >
                  Medicals by Year
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    graphType === "bp"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setGraphType("bp")}
                >
                  BP Graph
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    graphType === "sugar"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setGraphType("sugar")}
                >
                  Sugar Graph
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    graphType === "cholesterol"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setGraphType("cholesterol")}
                >
                  Cholesterol Graph
                </button>
              </div>

              {/* Graph area */}
              <div className="h-[75%] w-full">
                <ResponsiveContainer width="90%" height="100%">
                  <BarChart
                    data={
                      graphType === "employeeYearly"
                        ? employeeYearlyData
                        : graphType === "bp"
                        ? bpData
                        : graphType === "sugar"
                        ? sugarData
                        : graphType === "cholesterol"
                        ? cholesterolData
                        : []
                    }
                    margin={{
                      top: 30,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Value"
                      fill="#8884d8"
                      activeBar={<Rectangle fill="pink" stroke="blue" />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Close button */}
              <div className="flex justify-center mt-4">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded"
                  onClick={() => setShowGraph(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FTEReport;
