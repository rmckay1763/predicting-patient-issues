import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { Actions, useGlobal } from "../contexts/GlobalContext";
import BaseRoute from "./BaseRoute";
import PatientTable from "../components/PatientTable";
import EditProfileForm from "../components/EditProfileForm";
import PatientProfile from "../components/PatientProfile";
import AddPatientForm from "../components/AddPatientForm";
import { CheckToken } from "../controllers/APIController";

/**
 * Wrapper for authentication routes
 * @param {*} param0 The route to wrap
 * @returns Route to childe if authenticated, login route otherwise
 */
const AuthRoute = ({ children }) => {
  const [state, dispatch] = useGlobal();
  CheckToken(state.token)
    .catch(() => dispatch({type: Actions.clearToken}));
  return state.token ? children : <Navigate to="/login" />;
};

/**
 * Wrapper for generic routes
 * @param {*} param0 The route to wrapp
 * @returns Route to child if not authenticated, home page otherwise
 */
const GenericRoute = ({ children }) => {
  const [state, ] = useGlobal();
  return state.token ? <Navigate to="/" /> : children;
};

/**
 * @returns Component for login route
 */
export const LoginRoute = () => {
  return (
    <GenericRoute>
      <LoginForm />
    </GenericRoute>
  );
}

/**
 * @returns Component for patient table route
 */
export const PatientTableRoute = () => {
  return (
    <AuthRoute>
      <BaseRoute>
        <PatientTable />
      </BaseRoute>
    </AuthRoute>
  );
}

/**
 * @returns Component for edit profile route
 */
export const EditProfileRoute = () => {
  return (
    <AuthRoute>
      <BaseRoute>
        <EditProfileForm />
      </BaseRoute>
    </AuthRoute>
  );
}

/**
 * @returns Component for patient profile route
 */
 export const PatientProfileRoute = () => {
  return (
    <AuthRoute>
      <BaseRoute>
        <PatientProfile />
      </BaseRoute>
    </AuthRoute>
  );
}

/**
 * @returns Component for add patient route
 */
export const AddPatientRoute = () => {
  return (
    <AuthRoute>
      <BaseRoute>
        <AddPatientForm />
      </BaseRoute>
    </AuthRoute>
  )
}