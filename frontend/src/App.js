import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  LoginRoute, 
  PatientTableRoute, 
  EditProfileRoute, 
  PatientProfileRoute, 
  AddPatientRoute,
  EnterVitalsRoute,
  EditPatientRoute,
  UserTableRoute,
  AddUserRoute,
  NotificationRoute,
  RoleTableRoute,
  EditUserRoute,
  ResetPasswordRoute
} from "./routes/Routes";
import { GlobalProvider } from "./contexts/GlobalContext";

let token = localStorage.getItem("uid");
let user = JSON.parse(localStorage.getItem("user"));

/**
 * @returns Application
 */
export default function App() {

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
          <Route
            exact
            path="/users"
            element={<UserTableRoute />} />
          <Route 
            exact
            path="/newUser"
            element={<AddUserRoute />} />
          <Route
            exact
            path="/roles"
            element={<RoleTableRoute />} />
          <Route
            exact
            path="/notifications"
            element={<NotificationRoute/>} />
          <Route
            exact
            path="/editUser"
            element={<EditUserRoute/>} />
          <Route
            exact
            path="/resetPassword"
            element={<ResetPasswordRoute/>} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}
