import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { OCLMedicalProvider } from "./context/oclmedical.jsx";
import { ProfilecontextProvider } from "./context/Profilecontext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProfilecontextProvider>
      <OCLMedicalProvider>
        <Toaster position="top-center" reverseOrder={false} autoClose={3000} />
         <BrowserRouter>
           <App />
         </BrowserRouter>
      </OCLMedicalProvider>
    </ProfilecontextProvider>
  </StrictMode>
);
