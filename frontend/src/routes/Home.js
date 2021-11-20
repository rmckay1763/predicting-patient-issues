import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("uid");
    setToken(null);
    return navigate("/login");
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
