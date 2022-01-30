import { Navigate } from "react-router-dom";
import { useGlobal } from "../contexts/GlobalContext";

export const AuthRoute = ({ children }) => {
  const [state,] = useGlobal();
  return state.token ? children : <Navigate to="/login" />;
};

export const GenericRoute = ({ children }) => {
  const [state,] = useGlobal();
  return state.token ? <Navigate to="/" /> : children;
};