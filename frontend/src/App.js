import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  LoginRoute, 
  PatientTableRoute, 
  EditProfileRoute, 
  PatientProfileRoute, 
  AddPatientRoute
} from "./routes/Routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalProvider } from "./contexts/GlobalContext";
import { Colors } from "./resources/Colors";

let token = localStorage.getItem("uid");
let user = JSON.parse(localStorage.getItem("user"));

export default function App() {
  document.body.style.overflow = 'hidden';

  return (
    <GlobalProvider token={token} user={user}>
      <Router>
        <Routes>
          <Route
            exact
            path="/login"
            element={<LoginRoute />}
          />
          <Route
            exact
            path="/"
            element={<PatientTableRoute />}
          />
          <Route
            exact
            path="/editProfile"
            element={<EditProfileRoute />}
          />
          <Route
            exact
            path="/patientProfile"
            element={<PatientProfileRoute />}
          />
          <Route
            exact
            path="/newPatient"
            element={<AddPatientRoute />}
          />
        </Routes>
      </Router>
      <ToastContainer 
        toastStyle={{ backgroundColor: Colors.backgroundLighter, color: Colors.primary }}
      />
    </GlobalProvider>
  );
}
