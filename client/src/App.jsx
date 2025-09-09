import { Route, Routes,Navigate} from "react-router-dom";
import Userlogin from "./pages/userlogin";
import Main from "./pages/Main";
import OCL from "./pages/OCL";
import FTE from "./pages/FTE";
import Injury from "./pages/Injury";
import DailyMedical from "./pages/DailyMedical";
import OclReport from "./components/OclReport";
import DailyReport from "./components/DailyReport";
import InjuryReport from "./components/InjuryReport";
import Admin from "./pages/Admin";
import FTEReport from "./components/FTEReport";
import Editreport from "./components/editreport";
import UseprotectedRoute from "./UseprotectedRoute";
// import { useEffect } from "react";
// import { setupAxiosInterceptors } from "./axiossetup";
// import useAuthCheck from "./useAuthcheck";

function App() {
  // const navigate = useNavigate();
  // useAuthCheck();
  // useEffect(() => {
  //   setupAxiosInterceptors(navigate);
  // }, [navigate]);

  return (
    <Routes>
       {/* Public Route */}
      <Route path="/" element={<Userlogin />} />
      {/* Protected Routes */}
      <Route element={<UseprotectedRoute/>}>
        <Route path="/main" element={<Main />} />
        <Route path="/oclpage" element={<OCL />} />
        <Route path="/ftepage" element={<FTE />} />
        <Route path="/injury" element={<Injury />} />
        <Route path="/daily" element={<DailyMedical />} />
        <Route path="/OclReport" element={<OclReport />} />
        <Route path="/dailyReport" element={<DailyReport />} />
        <Route path="/injuryReport" element={<InjuryReport />} />
        <Route path="/admin" element={<Admin />}/>
        <Route path="/FTEReport" element={<FTEReport />} />
        <Route path="/editreport" element={<Editreport />} />
      </Route>
      {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
   </Routes>
  );
}
export default App;
