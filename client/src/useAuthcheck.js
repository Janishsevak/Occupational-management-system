import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() >= exp * 1000) {
          // Already expired
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (err) {
        console.error("Invalid token format", err);
        localStorage.removeItem("token");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);
}
