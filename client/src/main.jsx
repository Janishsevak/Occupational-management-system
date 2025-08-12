import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProfilecontextProvider } from "./context/Profilecontext.jsx";
import { store } from "./store";

import { Provider } from "react-redux";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ProfilecontextProvider>
        <Toaster position="top-center" reverseOrder={false} autoClose={3000} />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProfilecontextProvider>
    </Provider>
  </StrictMode>
);
