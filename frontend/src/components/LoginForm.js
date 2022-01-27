import React, { useEffect } from "react";
import { Avatar, TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import { Login } from "../controllers/APIController";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {Colors} from "../config/colors";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { useToken, useUser } = useAuth();
  const [token, setToken] = useToken;
  const [user, setUser] = useUser;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "PPCD - Login";  
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Login(username, password);
      setError(false);
      return setProfile(response);
    } catch (error) {
      console.error(error);
      return setError(true);
    }
  };

  const setProfile = async (response) => {
    let token = response.data.token;
    setToken(token);
    localStorage.setItem("uid", token);
    return navigate("/");
  };

  return (
    <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Avatar />
      <Typography variant="h5">Associate Login</Typography>
      <Box component="form" onSubmit={handleSubmit} method="post" >
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
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor: Colors.primary }}>
          Login
        </Button>
      </Box>
    </Box>
  );
}
