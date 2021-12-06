import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Container, TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import APIController from "../controllers/APIController";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await APIController.Login(username, password);
      setError(false);
      return setProfile(response);
    } catch (error) {
      console.error(error);
      return setError(true);
    }
  };

  const setProfile = async (response) => {
    let token = { ...response.data.token };
    setToken(token);
    localStorage.setItem("uid", token);
    return navigate("/");
  };

  return (
    <Container>
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar />
        <Typography variant="h5">Associate Login</Typography>
        <Box component="form" onSubmit={handleSubmit} method="post">
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            autoFocus
            name="username"
            value={username}
            error={error}
            helperText={error ? "Incorrect username and/or password." : ""}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoFocus
            name="password"
            value={password}
            error={error}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
