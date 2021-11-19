import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import { AuthProvider, ProtectedRoute } from "./contexts/AuthContext";

let token = localStorage.getItem("uid");

export default function App() {
  return (
    <Router>
      <AuthProvider userToken={token}>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
