import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginRoute, HomeRoute } from "./routes/Routes";
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
              <LoginRoute />
            }
          />
          <Route
            exact
            path="/"
            element={
              <HomeRoute />
            }
          />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}
