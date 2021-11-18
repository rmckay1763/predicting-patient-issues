import { Link } from "react-router-dom";
import { useState } from "react";
import { Avatar, Container, TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log({ username, password, hashedPassword });
  };

  return (
    <Container>
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar />
        <Typography>Log In</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate method="post">
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            autoFocus
            name="username"
            value={username}
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Log In
          </Button>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" align="center">
        Dont have an account? <Link to="/signup">Sign up!</Link>
      </Typography>
    </Container>
  );
}
