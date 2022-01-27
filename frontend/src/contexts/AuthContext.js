import { Navigate } from "react-router-dom";
import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = props => {
  let [token, setToken] = useState(props.token);
  let [user, setUser] = useState(props.user);

  return (
    <AuthContext.Provider 
      value={{ useToken: [token, setToken], useUser: [user, setUser] }}>
      {props.children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  userData: PropTypes.any,
  children: PropTypes.any,
};

export const useAuth = () => useContext(AuthContext);

export const AuthRoute = ({ children }) => {
  let { useToken, } = useAuth();
  let [token,] = useToken;

  return token ? children : <Navigate to="/login" />;
};

export const GenericRoute = ({ children }) => {
  let { useToken, } = useAuth();
  let [token,] = useToken;

  return token ? <Navigate to="/" /> : children;
};
