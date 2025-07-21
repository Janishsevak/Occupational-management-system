import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Profilecontext } from "../context/Profilecontext";

function Userlogin() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [origin, setorigin] = useState("");
  const [show, setshow] = useState(false);
  const navigate = useNavigate();
  const [login, setlogin] = useState("user");
  const { setuserprofile } = useContext(Profilecontext);

  const submithandler = async (e) => {
    e.preventDefault();
    const user = {
      username,
      password,
      origin,
    };
    try {
      console.log("Submitting:", { username, password, origin });
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
  };

  return (
    <div className="h-screen w-screen bg-photo relative md:flex flex-col">
      <div>
        {/* <img
          className="mx-auto pt-8 md:w-50 "
          src="./photo/logo_alivus.webp"
          alt="Logo"
        /> */}
        <h1 className="text-center text-4xl font-semibold mt-8">
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
                className="flex-1 p-2 bg-white rounded-lg text-md border border-gray-300"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center w-full">
              <label className="w-28 text-lg" htmlFor="password">
                Password:
              </label>
              <div className="relative flex-1">
                <input
                  className="w-full p-2 pr-10 bg-white rounded-lg text-md border border-gray-300"
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Password"
                />
                <span
                  onClick={() => setshow(!show)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
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
             <button className="bg-blue-500 p-1.5 text-xl font-sans font-semibold rounded-lg hover:bg-blue-800 hover:cursor-pointer mt-5">
            Login
          </button>
          <p className="text-center underline">Forget Password ?</p>
          </div>     
        </form>
      </div>
    </div>
  );
}

export default Userlogin;
