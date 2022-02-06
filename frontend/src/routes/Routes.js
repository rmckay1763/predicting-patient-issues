import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import Home from "../components/Home";
import { useGlobal } from "../contexts/GlobalContext";
import { NavigatorProvider } from "../contexts/Navigator";

/**
 * Wrapper for authentication routes
 * @param {*} param0 The route to wrap
 * @returns Route to childe if authenticated, login route otherwise
 */
const AuthRoute = ({ children }) => {
  const [state,] = useGlobal();
  return state.token ? children : <Navigate to="/login" />;
};

/**
 * Wrappper for generic routes
 * @param {*} param0 The route to wrapp
 * @returns Route to child if not authenticated, home page otherwise
 */
const GenericRoute = ({ children }) => {
  const [state,] = useGlobal();
  return state.token ? <Navigate to="/" /> : children;
};

/**
 * Login Route
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
 * Authenticated home page route
 * @returns Component for home page route
 */
export const HomeRoute = () => {
  return (
    <AuthRoute>
      <NavigatorProvider>
        <Home />
      </NavigatorProvider>
    </AuthRoute>
  );
}