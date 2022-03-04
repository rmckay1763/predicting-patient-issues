import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  LoginRoute, 
  PatientTableRoute, 
  EditProfileRoute, 
  PatientProfileRoute, 
  AddPatientRoute,
  EnterVitalsRoute,
  EditPatientRoute
} from "./routes/Routes";
import { GlobalProvider } from "./contexts/GlobalContext";

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
            element={<LoginRoute />} />
          <Route
            exact
            path="/"
            element={<PatientTableRoute />} />
          <Route
            exact
            path="/editProfile"
            element={<EditProfileRoute />} />
          <Route
            exact
            path="/patientProfile"
            element={<PatientProfileRoute />} />
          <Route
            exact
            path="/newPatient"
            element={<AddPatientRoute />} />
          <Route 
            exact
            path="/enterVitals"
            element={<EnterVitalsRoute />} />
          <Route 
            exact
            path="/editPatient"
            element={<EditPatientRoute />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}
