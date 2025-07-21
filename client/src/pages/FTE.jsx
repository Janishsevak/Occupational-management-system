import React, { useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';
import { useEffect } from 'react';
// ...existing code...
function FTE() {
  const origin = localStorage.getItem("origin");
  const [data1, setdata1] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    Name: "",
    EmployeeID: "",
    Department: "",
    DOJ: "",
    DOB: "",
    Desingation: "",
    height: "",
    weight: "",
    BP: "",
    cholstrol: "",
    sugar: "",
    Hb: "",
    remarks: "",
  });
  // ...existing code...

  const submitHandler = (e) => {
    e.preventDefault();
    const data = [
      {
        date: formData.date,
        Name: formData.Name,
        EmployeeID: formData.EmployeeID,
        Department: formData.Department,
        DOJ: formData.DOJ,
        DOB: formData.DOB,
        Desingation: formData.Desingation,
        height: formData.height,
        weight: formData.weight,
        BP: formData.BP,
        cholstrol: formData.cholstrol,
        sugar: formData.sugar,
        Hb: formData.Hb,
        remarks: formData.remarks,
      },
    ];
    try {

      axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/FTEmedical/ftemedicalentry`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "x-origin": origin,
        },
      });
      
        console.log("Data entry successfully");
        toast.success("Data entry successfully");
        setdata1([...data1, ...data]);
        resetHandler();
      
    } catch (error) {
      console.error("Error while submitting data:", error);
      toast.error("Something went wrong while submitting data");
    }
    
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

useEffect(() => {
  const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
     }
    fetchData();
    }, []);

  const resetHandler = () => {
    setFormData({
      date: "",
      Name: "",
      EmployeeID: "",
      Department: "",
      DOJ: "",
      DOB: "",
      Desingation: "",
      height: "",
      weight: "",
      BP: "",
      cholstrol: "",
      sugar: "",
      Hb: "",
      remarks: "",
    });
    setActiveIndex(null);
  };

  

  return (
    <div className="h-screen w-screen ">
      <div className="flex w-full">
       <button
          type="button"
          onClick={() => {
            navigate("/main");
          }}
          className="bg-gray-300 text-black px-6 mt-1 border-b-3 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
        >
          Back
        </button>
        <h1 className="font-bold text-3xl text-center border-b-3 p-2 w-[86%]">
          Employee Medical Report{" "}
        </h1>
        <button
          type="button"
          onClick={() => {
            navigate("/FTEReport");
          }}
          className="bg-green-300 text-black left-2 px-8 mt-1 border-b-3 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
        >
          Report
        </button>
      </div>
      
      <div className="flex flex-col h-screen">
        <div className="border border-gray-300 rounded-lg w-[100%] h-[43%] mt-1 ml-2 bg-white shadow  p-4">
          <form onSubmit={submitHandler}>
            <div>
              <h2 className="text-md font-semibold text-center p-1">
                FTE Medical Form
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-4 p-4 h-[100%]">
              {/* Render all fields as per FTEmedical.model.js */}
              <div className="flex flex-col">
                <label>Date</label>
                <input required type="date" value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Name</label>
                <input required type="text" value={formData.Name}
                  onChange={e => setFormData({ ...formData, Name: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Employee ID</label>
                <input required type="number" value={formData.EmployeeID}
                  onChange={e => setFormData({ ...formData, EmployeeID: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Department</label>
                <input required type="text" value={formData.Department}
                  onChange={e => setFormData({ ...formData, Department: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Date of Joining</label>
                <input required type="date" value={formData.DOJ}
                  onChange={e => setFormData({ ...formData, DOJ: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Date of Birth</label>
                <input required type="date" value={formData.DOB}
                  onChange={e => setFormData({ ...formData, DOB: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Desingation</label>
                <input required type="text" value={formData.Desingation}
                  onChange={e => setFormData({ ...formData, Desingation: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Height</label>
                <input required type="text" value={formData.height}
                  onChange={e => setFormData({ ...formData, height: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Weight</label>
                <input required type="text" value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>BP</label>
                <input required type="text" value={formData.BP}
                  onChange={e => setFormData({ ...formData, BP: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Cholstrol</label>
                <input required type="text" value={formData.cholstrol}
                  onChange={e => setFormData({ ...formData, cholstrol: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Sugar</label>
                <input required type="text" value={formData.sugar}
                  onChange={e => setFormData({ ...formData, sugar: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Hb</label>
                <input required type="text" value={formData.Hb}
                  onChange={e => setFormData({ ...formData, Hb: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
              <div className="flex flex-col">
                <label>Remarks</label>
                <input required type="text" value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-48" />
              </div>
            </div>
            {/* ...existing buttons... */}
          </form>
        </div>
        <div className="relative w-full overflow-y-scroll h-[50%]">
          <h1 className="text-center">Report Data</h1>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="border border-gray-300 p-2 w-10">Sr.No</th>
                <th className="border border-gray-300 p-2 w-32">Date</th>
                <th className="border border-gray-300 p-2 w-32">Name</th>
                <th className="border border-gray-300 p-2 w-32">EmployeeID</th>
                <th className="border border-gray-300 p-2 w-32">Department</th>
                <th className="border border-gray-300 p-2 w-32">DOJ</th>
                <th className="border border-gray-300 p-2 w-32">DOB</th>
                <th className="border border-gray-300 p-2 w-32">Desingation</th>
                <th className="border border-gray-300 p-2 w-32">Height</th>
                <th className="border border-gray-300 p-2 w-32">Weight</th>
                <th className="border border-gray-300 p-2 w-32">BP</th>
                <th className="border border-gray-300 p-2 w-32">Cholstrol</th>
                <th className="border border-gray-300 p-2 w-32">Sugar</th>
                <th className="border border-gray-300 p-2 w-32">Hb</th>
                <th className="border border-gray-300 p-2 w-32">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data1.length > 0 ? (
                data1.map((data, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      setFormData({
                        date: data.date,
                        Name: data.Name,
                        EmployeeID: data.EmployeeID,
                        Department: data.Department,
                        DOJ: data.DOJ,
                        DOB: data.DOB,
                        Desingation: data.Desingation,
                        height: data.height,
                        weight: data.weight,
                        BP: data.BP,
                        cholstrol: data.cholstrol,
                        sugar: data.sugar,
                        Hb: data.Hb,
                        remarks: data.remarks,
                      });
                      setActiveIndex(index);
                    }}
                    className={activeIndex === index ? "bg-gray-300" : ""}
                  >
                    <td className="border border-gray-300 text-center p-2">{index + 1}</td>
                    <td className="border border-gray-300 text-center p-2">{data.date ? new Date(data.date).toLocaleDateString("en-GB") : ""}</td>
                    <td className="border border-gray-300 text-center p-2">{data.Name}</td>
                    <td className="border border-gray-300 text-center p-2">{data.EmployeeID}</td>
                    <td className="border border-gray-300 text-center p-2">{data.Department}</td>
                    <td className="border border-gray-300 text-center p-2">{data.DOJ ? new Date(data.DOJ).toLocaleDateString("en-GB") : ""}</td>
                    <td className="border border-gray-300 text-center p-2">{data.DOB ? new Date(data.DOB).toLocaleDateString("en-GB") : ""}</td>
                    <td className="border border-gray-300 text-center p-2">{data.Desingation}</td>
                    <td className="border border-gray-300 text-center p-2">{data.height}</td>
                    <td className="border border-gray-300 text-center p-2">{data.weight}</td>
                    <td className="border border-gray-300 text-center p-2">{data.BP}</td>
                    <td className="border border-gray-300 text-center p-2">{data.cholstrol}</td>
                    <td className="border border-gray-300 text-center p-2">{data.sugar}</td>
                    <td className="border border-gray-300 text-center p-2">{data.Hb}</td>
                    <td className="border border-gray-300 text-center p-2">{data.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={15} className="text-center text-red-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// ...existing code...

export default FTE;
