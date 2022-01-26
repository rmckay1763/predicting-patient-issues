import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import { AuthProvider, AuthRoute, GenericRoute } from "./contexts/AuthContext";

let token = localStorage.getItem("uid");
let user = JSON.parse(localStorage.getItem("user"));

export default function App() {
  return (
    <Router>
      <AuthProvider token={token} user={user}>
        <Routes>
          <Route
            exact
            path="/login"
            element={
              <GenericRoute>
                <Login />
              </GenericRoute>
            }
          />
          <Route
            exact
            path="/"
            element={
              <AuthRoute>
                <Home />
              </AuthRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
