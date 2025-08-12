// axiosSetup.js
import axios from "axios";
import { Modal } from "antd";

export const setupAxiosInterceptors = (navigate) => {
  
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        error.response.data?.message?.includes("jwt expired")
      ) {
        Modal.error({
          title: "Session Expired",
          content: "Your login session has expired. Please log in again.",
          okText: "OK",
          onOk: () => {
            localStorage.removeItem("token");
            navigate("/login"); // redirect
            window.location.reload(); // ensure refresh
          },
        });
      }
      return Promise.reject(error);
    }
  );
};
