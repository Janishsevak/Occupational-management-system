import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProfilecontextProvider } from "./context/Profilecontext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProfilecontextProvider>
        <Toaster position="top-center" reverseOrder={false} autoClose={3000} />
         <BrowserRouter>
           <App />
         </BrowserRouter>
    </ProfilecontextProvider>
  </StrictMode>
);
