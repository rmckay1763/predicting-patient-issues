import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { Actions, useGlobal } from "../contexts/GlobalContext";
import BaseRoute from "./BaseRoute";
import PatientTable from "../components/PatientTable";
import EditProfileForm from "../components/EditProfileForm";
import PatientProfile from "../components/PatientProfile";
import AddPatientForm from "../components/AddPatientForm";
import EnterVitals from "../components/EnterVitals";
import EditPatientForm from "../components/EditPatientForm";
import { CheckAdminToken, CheckToken } from "../controllers/APIController";
import UserTable from "../components/UserTable";
import AddUserForm from "../components/AddUserForm";
import NotificationPage from "../components/NotificationPage";
import RoleTable from "../components/RoleTable";
import EditUserForm from "../components/EditUserForm";
import AdminResetPassword from "../components/AdminResetPassword";

/**
 * Wrapper for authentication routes
 * @param {*} param0 The route to wrap
 * @returns Route to child if authenticated, login route otherwise
 */
const AuthRoute = ({ children }) => {
  const [state, dispatch] = useGlobal();
  CheckToken(state.token)
    .catch(() => dispatch({type: Actions.clearToken}));
  return state.token ? children : <Navigate to="/login" />;
};

/**
 * Wrapper for administrator authentication routes
 * @param {*} param0 The route to wrap
 * @returns Route to child if authenticated, login route otherwise
 */
 const AdminAuthRoute = ({ children }) => {
  const [state, dispatch] = useGlobal();
  CheckAdminToken(state.token)
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
 * @returns Component for login route.
 */
export const LoginRoute = () => (
  <GenericRoute>
    <LoginForm />
  </GenericRoute>
)

/**
 * @returns Component for patient table route.
 */
export const UserTableRoute = () => (
  <AdminAuthRoute>
    <BaseRoute>
      <UserTable />
    </BaseRoute>
  </AdminAuthRoute>
  )

 /**
 * @returns Component for new user route.
 */
export const AddUserRoute = () => (
  <AdminAuthRoute>
    <BaseRoute>
      <AddUserForm />
    </BaseRoute>
  </AdminAuthRoute>
)

/**
 * @returns Component a edit user route.
 */
 export const EditUserRoute = () =>(
  <AdminAuthRoute>
    <BaseRoute>
      <EditUserForm />
    </BaseRoute>
  </AdminAuthRoute>
)

/**
 * @returns Component for a reset user password route.
 */
export const ResetPasswordRoute = () => (
  <AdminAuthRoute>
    <BaseRoute>
      <AdminResetPassword />
    </BaseRoute>
  </AdminAuthRoute>
)

/**
 * @returns Component for role table route.
 */
 export const RoleTableRoute = () => (
  <AdminAuthRoute>
    <BaseRoute>
      <RoleTable />
    </BaseRoute>
  </AdminAuthRoute>
  )

/**
 * @returns Component for patient table route.
 */
export const PatientTableRoute = () => (
  <AuthRoute>
    <BaseRoute>
      <PatientTable />
    </BaseRoute>
  </AuthRoute>
)

/**
 * @returns Component for edit profile route.
 */
export const EditProfileRoute = () => (
  <AuthRoute>
    <BaseRoute>
      <EditProfileForm />
    </BaseRoute>
  </AuthRoute>
)

/**
 * @returns Component for patient profile route.
 */
export const PatientProfileRoute = () => (
  <AuthRoute>
    <BaseRoute>
      <PatientProfile />
    </BaseRoute>
  </AuthRoute>
)

/**
 * @returns Component for add patient route.
 */
export const AddPatientRoute = () => (
  <AuthRoute>
    <BaseRoute>
      <AddPatientForm />
    </BaseRoute>
  </AuthRoute>
)

/**
 * @returns Component to enter vitals.
 */
export const EnterVitalsRoute = () =>(
  <AuthRoute>
    <BaseRoute>
      <EnterVitals />
    </BaseRoute>
  </AuthRoute>
)

/**
 * @returns Component to edit patient records.
 */
export const EditPatientRoute = () =>(
  <AuthRoute>
    <BaseRoute>
      <EditPatientForm />
    </BaseRoute>
  </AuthRoute>
)

/**
 * @returns Component for notifications route.
 */
export const NotificationRoute = () =>(
  <AuthRoute>
    <BaseRoute>
      <NotificationPage />
    </BaseRoute>
  </AuthRoute>
)