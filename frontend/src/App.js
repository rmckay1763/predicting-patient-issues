import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Navbar from "./components/NavBar";
import NotificationContext from "./contexts/NotificationContext";
import SplitPane, {
  DividerPane,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRightEditProfile,
  SplitPaneRightPatients,
  SplitPaneTop,
} from "./components/SplitPane";
import { AuthProvider, AuthRoute, GenericRoute } from "./contexts/AuthContext";

let token = localStorage.getItem("uid");

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
      <AuthProvider userToken={token}>
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
                    <SplitPane className="split-pane-row">
                      <SplitPaneLeft/>
                      <SplitPaneRightPatients />
                    </SplitPane>
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
                    <SplitPane className="split-pane-row">
                      <SplitPaneLeft/>
                      <SplitPaneRightEditProfile />
                    </SplitPane>
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
