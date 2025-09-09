import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-hot-toast";

const ProtectedRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to continue");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        toast.error("Session expired, please login again");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      localStorage.removeItem("token");
      toast.error("Invalid session, please login again");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
