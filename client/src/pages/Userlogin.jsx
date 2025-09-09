import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Profilecontext } from "../context/Profilecontext";
import { PiSpinnerGapBold } from "react-icons/pi";
import { ImCancelCircle } from "react-icons/im";


function Userlogin() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [origin, setorigin] = useState("");
  const [show, setshow] = useState(false);
  const navigate = useNavigate();
  const [login, setlogin] = useState("user");
  const [loading, setLoading] = useState(false);
  const { setuserprofile } = useContext(Profilecontext);
  const [showSlider, setShowSlider] = useState(false);
  const [FormData, setformdata] = useState({
    username: "",
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  const submithandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const user = {
      username,
      password,
      origin,
    };
    try {
      
      const url =
        login === "admin"
          ? `${import.meta.env.VITE_BASE_URL}/api/v1/admin/adminlogin`
          : `${import.meta.env.VITE_BASE_URL}/api/v1/users/login`;
      const response = await axios.post(url, user, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        console.log("Login successful");
        toast.success("Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("origin", origin);
        localStorage.setItem("user", JSON.stringify(response.data.admin));
        setuserprofile(user);

        if (login === "admin") {
          navigate("/admin"); // or whatever route admin should go to
        } else {
          navigate("/main");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
    finally {
    setLoading(false); // Stop loading
  }
  };

  return (
    <div className="h-screen w-screen bg-photo relative md:flex flex-col">
      <div>
        {/* <img
          className="mx-auto pt-8 md:w-50 "
          src="./photo/logo_alivus.webp"
          alt="Logo"
        /> */}
        <h1 className="text-center text-green-700 text-4xl font-semibold mt-8">
          OHC Management System
        </h1>
        <p className="mx-auto text-center text-lg mt-22 max-w-2xl">
          Committed to a Safer Workplace Promoting health, safety, and
          well-being in every work environment. We empower organizations to
          protect their people through proactive safety standards and education.
          Safety isn’t just a priority — it’s our mission.
        </p>
      </div>
      <div
        className="bg-blue-100 h-[450px] w-full rounded-lg mt-8
         md:absolute md:top-35  md:right-6 md:w-1/4 md:mt-2"
      >
        <form
          onSubmit={(e) => {
            submithandler(e);
          }}
        >
          <h2 className="text-center text-2xl mt-3">Login</h2>
          <div className="flex justify-center gap-5 mt-4">
            <label className="text-lg hover:cursor-pointer">
              <input
                type="radio"
                value="user"
                checked={login === "user"}
                onChange={() => setlogin("user")}
              />
              User
            </label>
            <label className="text-lg hover:cursor-pointer">
              <input
                type="radio"
                value="admin"
                checked={login === "admin"}
                onChange={() => setlogin("admin")}
              />
              Admin
            </label>
          </div>
          <div className="flex flex-col gap-6 px-10 mt-8 w-full max-w-md mx-auto">
            {/* Username Field */}
            <div className="flex items-center w-full">
              <label className="w-28 text-lg" htmlFor="username">
                Username:
              </label>
              <input
                className="w-full flex-1 p-2 bg-white rounded-lg text-md border border-gray-300"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="Username"
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center w-full">
              <label className="w-28 text-lg" htmlFor="password">
                Password:
              </label>
              <div className="relative flex-1">
                <input
                  className="w-full p-2 bg-white rounded-lg text-md border border-gray-300"
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Password"
                />
                <span
                  onClick={() => setshow(!show)}
                  className="absolute inset-y-2 right-2 flex items-center text-gray-600 hover:cursor-pointer"
                >
                  {show ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                </span>
              </div>
            </div>

            {/* Origin Dropdown */}
            <div
              className={`flex items-center w-full ${
                login === "admin" ? "hidden" : ""
              }`}
            >
              <label className="w-28 text-lg" htmlFor="origin">
                Origin:
              </label>
              <select
                className="flex-1 p-2 rounded-md text-md bg-white border border-gray-300"
                value={origin}
                onChange={(e) => setorigin(e.target.value)}
                required
              >
                <option>Select origin</option>
                <option value="Ankleshwar">Ankleshwar</option>
                <option value="Dahej">Dahej</option>
                <option value="Kurkumbh">Kurkumbh</option>
              </select>
            </div>
             <button className="bg-blue-500 p-1.5 text-xl font-sans font-semibold rounded-lg hover:bg-blue-800 hover:cursor-pointer mt-5" disabled={loading}>
            Login
            {loading && <PiSpinnerGapBold className="animate-spin inline-block ml-2" />}
          </button>
          <button onClick={()=>setShowSlider(true)} className="text-center underline">Forget Password ?</button>
          </div>     
        </form>
        {showSlider && (
                <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transition-transform duration-1000">
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
      </div>
    </div>
  );
}

export default Userlogin;
