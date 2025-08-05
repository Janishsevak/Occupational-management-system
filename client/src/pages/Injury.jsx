import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Injury() {
  const origin = localStorage.getItem("origin");

  const [formData, setFormData] = useState({
    date: "",
    Name: "",
    Department: "",
    age: "",
    category: "",
    Designation: "",
    injury: "",
    Treatment: "",
    Refer_to: "",
    Admit: "",
    FollowUpDate: "",
    Discharge: "",
    Return_to_Duty: "",
    BillAmount: "",
  });
  const navigate = useNavigate();
  const [data1, setdata1] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/v1/injurydata/injurydata", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "x-origin": origin,
        },
      })
      .then((res) => {
        const sortedData = res.data.entries
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setdata1(sortedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = [
      {
        date: formData.date,
        Name: formData.Name,
        Department: formData.Department,
        category: formData.category,
        Designation: formData.Designation,
        age: formData.age,
        injury: formData.injury,
        Treatment: formData.Treatment,
        Refer_to: formData.Refer_to,
        Admit: formData.Admit,
        FollowUpDate: formData.FollowUpDate,
        Discharge: formData.Discharge,
        Return_to_Duty: formData.Return_to_Duty,
        BillAmount: formData.BillAmount,
      },
    ];
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/injurydata/injurydata`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-origin": origin,
          },
        }
      );
      console.log("Data entry successfully");
      toast.success("Data entry successfully");
      setdata1([...data1, ...data]);
      resetHandler();
    } catch (error) {
      console.error("Error while submitting data:", error);
      toast.error("Something went wrong while submitting data");
    }
  };
  const resetHandler = () => {
    setFormData({
      date: "",
      Name: "",
      Department: "",
      Designation: "",
      age: "",
      injury: "",
      Treatment: "",
      Refer_to: "",
      Admit: "",
      FollowUpDate: "",
      Discharge: "",
      Return_to_Duty: "",
      BillAmount: "",
    });
    setActiveIndex(null);
  };

  const deleteHandler = async () => {
    if (activeIndex !== null) {
      const confirmDelete = window.confirm(
        "Are you sure to delete this entry?"
      );
      if (!confirmDelete) {
        return;
      }
      const idToDelete = data1[activeIndex]?.id || data1[activeIndex]?._id;
      if (!idToDelete) {
        alert("Could not find record id.");
        return;
      }
      try {
        await axios.delete(
          `http://localhost:8000/api/v1/injurydata/deleteinjurydata/${idToDelete}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "x-origin": origin,
            },
          }
        );
        toast.success("Data deleted successfully");
        setActiveIndex(null);
        resetHandler();
        fetchData(); // Always fetch fresh data after delete
      } catch (error) {
        console.error("Error deleting data:", error);
        toast.error("Error deleting data");
      }
    } else {
      alert("Please select an entry to delete.");
    }
  };
  const updateHandler = async () => {
    if (activeIndex !== null) {
      const confirmUpdate = window.confirm(
        "Are you sure to update this entry?"
      );
      if (!confirmUpdate) {
        return;
      }
      const idToupdate = data1[activeIndex]?.id || data1[activeIndex]?._id;

      if (!idToupdate) {
        alert("Could not find record id.");
        return;
      }
      try {
        await axios.put(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/v1/injurydata/updateinjurydata/${idToupdate}`,
          {
            date: formData.date,
            Name: formData.Name,
            Department: formData.Department,
            category: formData.category,
            Designation: formData.Designation,
            age: formData.age,
            injury: formData.injury,
            Treatment: formData.Treatment,
            Refer_to: formData.Refer_to,
            Admit: formData.Admit,
            FollowUpDate: formData.FollowUpDate,
            Discharge: formData.Discharge,
            Return_to_Duty: formData.Return_to_Duty,
            BillAmount: formData.BillAmount,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "x-origin": origin,
            },
          }
        );
        toast.success("Data updated successfully");
        setActiveIndex(null);
        resetHandler();
        fetchData(); // Always fetch fresh data after delete
      } catch (error) {
        console.error("Error updating data:", error);
        toast.error("Error updating data");
      }
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
          className="bg-gray-300 text-black px-6 mt-1 border-b-3 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
        >
          Back
        </button>
        <h1 className="font-bold text-3xl text-center border-b-3 p-2 w-[90%]">
          Injury Report{" "}
        </h1>
        <button
          type="button"
          onClick={() => {
            navigate("/injuryReport");
          }}
          className="bg-green-300 text-bla ck px-8 mt-1 border-b-3 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
        >
          Report
        </button>
      </div>
      <div className="flex flex-col h-screen">
        <div className="border border-gray-300 rounded-lg w-[100%] h-[380px] mt-1 ml-2 bg-white shadow  p-4">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div>
              <h2 className="text-md font-semibold text-center p-1">
                Injury Form
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-4 p-4 h-[100%]">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Date</label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  placeholder="Enter Name"
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Department</label>
                <input
                  required
                  type="text"
                  value={formData.Department}
                  onChange={(e) =>
                    setFormData({ ...formData, Department: e.target.value })
                  }
                  placeholder="Enter Department"
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-48"
                >
                  <option value="">--Select--</option>
                  <option value="Contract">Contract</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div className="flex flex-col">
                {formData.category === "Employee" ? (
                  <>
                    <label className="text-sm font-semibold mb-1">
                      Employee Code
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
                      className="border border-gray-300 rounded-lg p-2 w-48"
                      placeholder="Enter Employee Code"
                    />
                  </>
                ) : (
                  <>
                    <label className="text-sm font-semibold mb-1">
                      Contract
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
                      className="border border-gray-300 rounded-lg p-2 w-48"
                    >
                      <option value="">--Select Contractor--</option>
                      <option value="Poonam">Poonam</option>
                      <option value="SPS">SPS</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Age</label>
                <input
                  required
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="Enter Age"
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Injury</label>
                <input
                  required
                  type="text"
                  value={formData.injury}
                  onChange={(e) =>
                    setFormData({ ...formData, injury: e.target.value })
                  }
                  placeholder="Enter Injury Details"
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Treatment</label>
                <input
                  required
                  type="text"
                  value={formData.Treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, Treatment: e.target.value })
                  }
                  placeholder="Enter Treatment Details"
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Refer To</label>
                <input
                  type="text"
                  value={formData.Refer_to}
                  onChange={(e) =>
                    setFormData({ ...formData, Refer_to: e.target.value })
                  }
                  placeholder="Enter Treatment Details"
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Admit</label>
                <input
                  type="text"
                  value={formData.Admit}
                  onChange={(e) =>
                    setFormData({ ...formData, Admit: e.target.value })
                  }
                  placeholder="Enter Treatment Details"
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Follow-up Date
                </label>
                <input
                  type="Date"
                  value={formData.FollowUpDate}
                  onChange={(e) =>
                    setFormData({ ...formData, FollowUpDate: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Discharge</label>
                <input
                  type="Date"
                  value={formData.Discharge}
                  onChange={(e) =>
                    setFormData({ ...formData, Discharge: e.target.value })
                  }
                  placeholder="Enter Discharge Details"
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Return-to-Duty
                </label>
                <input
                  type="date"
                  value={formData.Return_to_Duty}
                  onChange={(e) =>
                    setFormData({ ...formData, Return_to_Duty: e.target.value })
                  }
                  placeholder="Enter Treatment Details"
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Bill Amount
                </label>
                <input
                  type="Number"
                  value={formData.BillAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, BillAmount: e.target.value })
                  }
                  placeholder="Enter Bill Amount "
                  className="border border-gray-300 rounded-lg p-2 w-48"
                />
              </div>
            </div>

            <div className="flex gap-3 p-2 mt-3 items-center w-full justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-10 py-2 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
              >
                Submit
              </button>
              <button
                type="reset"
                onClick={resetHandler}
                className="bg-blue-300 text-black px-10 py-2 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={deleteHandler}
                className="bg-red-300 text-black px-10 py-2 rounded-lg hover:bg-gray-600 hover:cursor-pointer"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={updateHandler}
                className="bg-green-300 text-black px-10 py-2 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
              >
                Update
              </button>
            </div>
          </form>
        </div>
        <div className="h-full w-full mt-5 overflow-y-scroll h-[]">
          <h1 className="text-center">Report Data</h1>

          <table className=" w-full border-collapse border border-gray-300 " />
          <thead className=" bg-gray-200 sticky top-0">
            <tr>
              <th className="border border-gray-300 p-2 w-10">Sr.No</th>
              <th className="border border-gray-300 p-2 w-30">Date</th>
              <th className="border border-gray-300 p-2 w-30">Name</th>
              <th className="border border-gray-300 p-2 w-30">Department</th>
              <th className="border border-gray-300 p-2 w-30">Category</th>
              <th className="border border-gray-300 p-2 w-30 ">ID/Contract</th>
              <th className="border border-gray-300 p-2 w-30">Age</th>
              <th className="border border-gray-300 p-2 w-30 ">Injury</th>
              <th className="border border-gray-300 p-2 w-30 ">Treatment</th>
              <th className="border border-gray-300 p-2 w-30">Refer-To</th>
              <th className="border border-gray-300 p-2 w-30">Admit</th>
              <th className="border border-gray-300 p-2 w-30">Follow-up</th>
              <th className="border border-gray-300 p-2 w-30">Discharge</th>
              <th className="border border-gray-300 p-2 w-30">
                Return to Duty
              </th>
              <th className="border border-gray-300 p-2 w-30">Bill Amount</th>
            </tr>
          </thead>
          <tbody>
            {data1.length > 0 ? (
              data1.map((data, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    setFormData({
                      date: data.date || "",
                      Name: data.Name || "",
                      Department: data.Department || "",
                      category: data.category || "",
                      Designation: data.Designation || "",
                      age: data.age || "",
                      injury: data.injury || "",
                      Treatment: data.Treatment || "",
                      Refer_to: data.Refer_to || "",
                      Admit: data.Admit || "",
                      FollowUpDate: data.FollowUp_Date || "",
                      Discharge: data.Discharge || "",
                      Return_to_Duty: data.Return_to_Duty || "",
                      BillAmount: data.BillAmount || "",
                    });
                    setActiveIndex(index);
                    console.log("Selected data:", data);
                  }}
                  className={activeIndex === index ? "bg-gray-300" : ""}
                >
                  <td className="border border-gray-300 p-2 w-10 hover:cursor-pointer">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.date
                      ? new Date(data.date).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.Name}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.Department}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.category}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.Designation}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.age}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.injury}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.Treatment}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.Refer_to}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.Admit}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.FollowUp_Date
                      ? new Date(data.FollowUp_Date).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.Discharge
                      ? new Date(data.Discharge).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.Return_to_Duty
                      ? new Date(data.Return_to_Duty).toLocaleDateString(
                          "en-GB"
                        )
                      : ""}
                  </td>
                  <td className="border border-gray-300 p-2 w-30 hover:cursor-pointer">
                    {data.BillAmount}
                  </td>
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
        </div>
      </div>
    </div>
  );
}

export default Injury;
