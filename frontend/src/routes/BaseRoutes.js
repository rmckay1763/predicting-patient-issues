/**
 * Provides authentication routes. 
 * All routes should be wrapped with one of the below options.
 */

import { Navigate } from "react-router-dom";
import { useGlobal } from "../contexts/GlobalContext";

/**
 * Wrapper for authentication wraps
 * @param {*} param0 The route to wrap
 * @returns Child route if authenticated, login route otherwise
 */
export const AuthRoute = ({ children }) => {
  const [state,] = useGlobal();
  return state.token ? children : <Navigate to="/login" />;
};

/**
 * Generic route for login page
 * @param {*} param0 The login route
 * @returns Route to home page if authenticated, login route otherwise
 */
export const GenericRoute = ({ children }) => {
  const [state,] = useGlobal();
  return state.token ? <Navigate to="/" /> : children;
};