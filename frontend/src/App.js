import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
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
import { useState } from "react";

let token = localStorage.getItem("uid");

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
              // Turn to AuthRoute
              <AuthRoute>
                <Navbar />
                <div>
                  <NotificationContext.Provider value={{}}>
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
              // Turn to AuthRoute
              <GenericRoute>
                <Navbar />
                <div>
                  <NotificationContext.Provider value={{}}>
                    <SplitPane className="split-pane-row">
                      <SplitPaneLeft/>
                      <SplitPaneRightEditProfile />
                    </SplitPane>
                  </NotificationContext.Provider>
                </div>

              </GenericRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
