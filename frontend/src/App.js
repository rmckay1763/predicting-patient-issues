import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Navbar from "./components/NavBar";
import { AuthRoute, GenericRoute } from "./routes/BaseRoutes";
import HomePatients from "./routes/HomePatients";
import EditProfile from "./routes/EditProfile";
import { GlobalProvider } from "./contexts/GlobalContext";

let token = localStorage.getItem("uid");
let user = JSON.parse(localStorage.getItem("user"));

export default function App() {
  document.body.style.overflow = 'hidden';

  return (
    <GlobalProvider token={token} user={user}>
      <Router>
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
                <Navbar />
                <div>
                  <HomePatients/>
                </div>

              </AuthRoute>
            }
          />
          <Route
            exact
            path="/editProfile"
            element={
              <AuthRoute>
                <Navbar />
                <div>
                  <EditProfile/>
                </div>
              </AuthRoute>
            }
          />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}
