import { Navigate } from "react-router-dom";
import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ userToken, children }) => {
  let [token, setToken] = useState(userToken);

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  userData: PropTypes.any,
  children: PropTypes.any,
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children }) => {
  let auth = useAuth();

  return auth.token ? children : <Navigate to="/login" />;
};
