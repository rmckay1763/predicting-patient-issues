import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Navbar from "./components/NavBar";
import NotificationContext from "./contexts/NotificationContext";
import { AuthProvider, AuthRoute, GenericRoute } from "./contexts/AuthContext";
import HomePatients from "./routes/HomePatients";
import EditProfile from "./routes/EditProfile";

let token = localStorage.getItem("uid");
let user = JSON.parse(localStorage.getItem("user"));

const patients = [
  {
    id: 1,
    name: "Nelson Mandela",
    condition: "Critical",
    description: "Blood sugar is dropping.",
  },
  {
    id: 2,
    name: "Walt Disney",
    condition: "Adverse",
    description: "Needs assistance.",
  },
  {
    id: 3,
    name: "Oprah Winfrey",
    condition: "Minor",
    description: "Minor dehydration.",
  },
  {
    id: 5,
    name: "Oprah Winfrey",
    condition: "Minor",
    description: "Minor dehydration.",
  },
  {
    id: 7,
    name: "Oprah Winfrey",
    condition: "Minor",
    description: "Minor dehydration.",
  }
];

export default function App() {
  document.body.style.overflow = 'hidden';

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
                <Navbar />
                <div>
                  <NotificationContext.Provider value={{patients}}>
                    <HomePatients/>
                  </NotificationContext.Provider>
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
                  <NotificationContext.Provider value={{patients}}>
                    <EditProfile/>
                  </NotificationContext.Provider>
                </div>

              </AuthRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
