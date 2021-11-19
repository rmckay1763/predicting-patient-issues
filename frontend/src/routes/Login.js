import { useState } from "react";
import { Avatar, Container, TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { username: username, password: password };
    try {
      const res = await axios.request({
        url: `${process.env.REACT_APP_API_BASE_URL}/login/`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: loginData,
      });
      const json_res = await res.data;
      console.log(json_res);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar />
        <Typography variant="h5">Associate Login</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate method="post">
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
