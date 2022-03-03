import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Avatar, 
  TextField, 
  Typography, 
  Button, 
  Box,
} from "@mui/material";
import { Login } from "../controllers/APIController";
import { Actions, useGlobal } from "../contexts/GlobalContext";
import { Colors } from "../resources/Colors";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [, dispatch] = useGlobal();

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
    let user = response.data.user;
    dispatch({type: Actions.setToken, payload: token})
    dispatch({type: Actions.setUser, payload: user})
    localStorage.setItem("uid", token);
    localStorage.setItem("user", JSON.stringify(user));

    if(user.admin)
      return navigate("/users");
    else
      return navigate("/");
  };

  const boxStyle = {
    mt: 8, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    '& .MuiAvatar-root': {
      color: Colors.secondary,
      backgroundColor: Colors.primary,
      alignItems: "center", 
    },
    '& .MuiTypography-h5': {
      color: Colors.primary,
      textAlign: "center",
    },
    '& .MuiOutlinedInput-root': {
      color: Colors.primary, 
      input: {color: Colors.primary},
      '& fieldset': {
        borderColor: Colors.primary,
      },
      '&.Mui-focused fieldset': {
        borderColor: Colors.primary
      },
      '&:hover fieldset': {
        borderColor: Colors.primary,
      },
    },
    '& .MuiInputLabel-outlined': {
      color: Colors.primary + '90',
    },
    '& label.Mui-focused': {
      color: Colors.primary,
    },
    '& .MuiButton-contained': {
      color: Colors.backgroundLighter,
      backgroundColor: Colors.primary,
      '&:hover': {
        color: Colors.primary,
        backgroundColor: Colors.secondary,
      }
    },
  }

  return (
    <Box sx={boxStyle}>
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
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor:  Colors.primary }}>
          Login
        </Button>
      </Box>
    </Box>
  );
}
