import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Stack } from "@mui/material";
import { Login } from "../controllers/APIController";
import { Actions, useGlobal } from "../contexts/GlobalContext";
import { 
    StyledTypography, 
    StyledTextField, 
    StyledButtonPrimary
} from "../resources/StyledComponents";
import { Colors } from "../resources/Colors";

/**
 * @returns Component to login to the application.
 */
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

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            method="post" 
            sx={{
                display: "flex",  
                justifyContent: "center",
                '& .MuiAvatar-root': {
                    backgroundColor: Colors.primary, 
                    color: Colors.secondary, 
                }
            }}
        >
          <Stack mt={8} spacing={3} align="center">
              <Box><Avatar /></Box>
              <StyledTypography variant="h5">Associate Login</StyledTypography>
              <StyledTextField
                  required
                  label="Username"
                  autoFocus
                  value={username}
                  error={error}
                  helperText={error ? "Incorrect username and/or password." : ""}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <StyledTextField
                  required
                  label="Password"
                  type="password"
                  value={password}
                  error={error}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <StyledButtonPrimary onClick={handleSubmit}>
                  Login
              </StyledButtonPrimary>
          </Stack>
      </Box>
  );
}
