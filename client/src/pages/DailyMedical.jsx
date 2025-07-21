import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function DailyMedical() {
  const [formData, setFormData] = useState({
    date: "",
    Name: "",
    Department: "",
    age: "",
    category: "",
    Designation: "",
    purpose: "",
    Treatment: "",
  });
  const navigate = useNavigate();
  const [data1, setdata1] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const origin = localStorage.getItem("origin");
  console.log("Sending origin:", origin); // Should log: Ankleshwar

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/v1/dailymedical/getdailymedicalentries",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-origin": origin,
          },
        }
      );
      const sortedData = response.data.entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
      setdata1(sortedData)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchData();
}, []); 

  const submitHandler = async (e) => {
    e.preventDefault();
    let dateValue = formData.date;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateValue)) {
      // If format is DD-MM-YYYY, convert to YYYY-MM-DD
      const [day, month, year] = dateValue.split("-");
      dateValue = `${year}-${month}-${day}`;
    }
    const data = {
      date: dateValue,
      Name: formData.Name,
      Department: formData.Department,
      category: formData.category,
      age: formData.age ? Number(formData.age) : null,
      Designation: formData.Designation,
      purpose: formData.purpose,
      Treatment: formData.Treatment,
    };
    if (
      !data.date ||
      !data.Name ||
      !data.Department ||
      !data.category ||
      !data.age ||
      !data.Designation ||
      !data.purpose ||
      !data.Treatment
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/dailymedical/dailymedicalentry`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-origin": origin
          },
        }
      );
      if (response.status === 201) {
        console.log("Form submitted successfully");
        toast.success("Form submitted successfully");
        setdata1([...data1, data]);
        setFormData({
          date: "",
          Name: "",
          Department: "",
          category: "",
          age: "",
          Designation: "",
          purpose: "",
          Treatment: "",
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.name === "TokenExpiredError"
      ) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        console.error("Error submitting form:", error);
        toast.error("Error submitting form");
      }
    }
  };
  const resetHandler = () => {
    setFormData({
      date: "",
      Name: "",
      Department: "",
      Designation: "",
      age: "",
      purpose: "",
      Treatment: "",
    });
    setActiveIndex(null);
  };

  const deleteHandler = () => {
    if (activeIndex !== null) {
      const confirmDelete = window.confirm(
        "Are you sure to delete this entry?"
      );
      if (!confirmDelete) {
        return;
      }
      const newData = data1.filter((_, index) => index !== activeIndex);
      setdata1(newData);
      setActiveIndex(null);
      resetHandler();
    }
  };

  const updateHandler = () => {
    if (activeIndex !== null) {
      const confirmUpdate = window.confirm(
        "Are you sure to update this entry?"
      );
      if (!confirmUpdate) {
        return;
      }
      const updatedData = data1.map((item, index) =>
        index === activeIndex ? formData : item
      );
      setdata1(updatedData);
      resetHandler();
    } else {
      alert("Please select an entry to update.");
    }
  };

  return (
    <div className="h-screen w-screen ">
      <div className="flex w-full">
        <button
          type="button"
          onClick={() => {
            navigate("/main");
          }}
          className="bg-gray-300 text-black px-6 mt-1 border-b-3 rounded-lg hover:bg-gray-400"
        >
          Back
        </button>
        <h1 className="font-bold text-3xl text-center border-b-3 p-2 w-[86%]">
          Daily Paitent Report{" "}
        </h1>
        <button
          type="button"
          onClick={() => {
            navigate("/dailyReport");
          }}
          className="bg-green-300 text-black left-2 px-8 mt-1 border-b-3 rounded-lg hover:bg-gray-400"
        >
          Report
        </button>
      </div>
      <div className="flex h-full w-full">
        <div className="relative border border-gray-300 rounded-lg w-[40%] h-[100%] mt-1 ml-2 bg-white shadow overflow-y-scroll p-4">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div>
              <h2 className="text-md font-semibold text-center p-1">
                Patient Medical Form
              </h2>
            </div>
            <div className="flex gap-2 p-2 items-center">
              <label className="text-lg font-semibold w-40">Date</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
              />
            </div>
            <div className="flex gap-2 p-2 items-center">
              <label className="text-lg font-semibold w-40">Name</label>
              <input
                required
                type="text"
                value={formData.Name}
                onChange={(e) => {
                  setFormData({ ...formData, Name: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                placeholder="Enter Name"
              />
            </div>
            <div className="flex gap-2 p-2 items-center">
              <label className="text-lg font-semibold w-40">Department</label>
              <input
                required
                type="text"
                value={formData.Department}
                onChange={(e) => {
                  setFormData({ ...formData, Department: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                placeholder="Enter Department"
              />
            </div>
            <div className="flex gap-2 p-2 items-center">
              <label className="text-lg font-semibold w-40">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
              >
                <option value="">--Select--</option>
                <option value="Contract">Contract</option>
                <option value="FTE">Employee</option>
              </select>
            </div>

            <div className="flex gap-2 p-2 items-center">
              {formData.category === "FTE" ? (
                <>
                  <label className="text-lg font-semibold w-40">
                    Employeecode
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.Designation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Designation: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                    placeholder="Enter Employee Code"
                  />
                </>
              ) : (
                <>
                  <label className="text-lg font-semibold w-40">
                    Contractor
                  </label>
                  <select
                    required
                    value={formData.Designation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Designation: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                  >
                    <option value="">--Select Contractor--</option>
                    <option value="Poonam">Poonam</option>
                    <option value="SPS">SPS</option>
                    {/* Add more contractor options as needed */}
                  </select>
                </>
              )}
            </div>
            <div className="flex gap-2 p-2 items-center">
              <label className="text-lg font-semibold w-40">Age</label>
              <input
                required
                type="number"
                value={formData.age}
                onChange={(e) => {
                  setFormData({ ...formData, age: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                placeholder="Enter Age"
              />
            </div>
            <div className="flex gap-2 p-2 items-center">
              <label className="text-lg font-semibold w-40">Purpose</label>
              <input
                required
                type="text"
                value={formData.purpose}
                onChange={(e) => {
                  setFormData({ ...formData, purpose: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                placeholder="Enter purpose Details"
              />
            </div>
            <div className="flex gap-2 p-2 items-center">
              <label className="text-lg font-semibold w-40">Treatment</label>
              <input
                required
                type="text"
                value={formData.Treatment}
                onChange={(e) => {
                  setFormData({ ...formData, Treatment: e.target.value });
                }}
                className="border border-gray-300 rounded-lg w-50 p-2 mt-1"
                placeholder="Enter Treatment Details"
              />
            </div>

            <div className="flex gap-3 p-2 items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
              >
                Submit
              </button>
              <button
                type="reset"
                onClick={resetHandler}
                className="bg-blue-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={deleteHandler}
                className="bg-red-300 text-black px-4 py-2 rounded-lg hover:bg-gray-600 hover:cursor-pointer"
              >
                Delete
              </button>
              <button
                type="submit"
                onClick={updateHandler}
                className="bg-green-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
              >
                Update
              </button>
            </div>
          </form>
        </div>
        <div className="w-full">
          <h1 className="text-center">Report Data</h1>
          <table className="w-full border-collapse border border-gray-300" />
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="border border-gray-300 p-2 w-32">Date</th>
              <th className="border border-gray-300 p-2 w-32">Name</th>
              <th className="border border-gray-300 p-2 w-32">Department</th>
              <th className="border border-gray-300 p-2 w-32">Category</th>
              <th className="border border-gray-300 p-2 w-32">Age</th>
              <th className="border border-gray-300 p-2 w-32 ">Designation</th>
              <th className="border border-gray-300 p-2 w-32">Purpose</th>
              <th className="border border-gray-300 p-2 w-32 ">Treatment</th>
            </tr>
          </thead>
          <tbody>
            {data1.map((data, index) => (
              <tr
                key={index}
                onClick={() => {
                  setFormData({
                    date: data.date,
                    Name: data.Name,
                    Department: data.Department,
                    category: data.category,
                    Designation: data.Designation,
                    age: data.age,
                    purpose: data.purpose,
                    Treatment: data.Treatment,
                  });
                  setActiveIndex(index);
                }}
                className={activeIndex === index ? "bg-gray-300" : ""}
              >
                <td className="border border-gray-300 text-center p-2">
                  {new Date(data.date).toLocaleDateString("en-GB")}
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
                  {data.age}
                </td>
                <td className="border border-gray-300 text-center p-2">
                  {data.Designation}
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
        </div>
      </div>
    </div>
  );
}

export default DailyMedical;
