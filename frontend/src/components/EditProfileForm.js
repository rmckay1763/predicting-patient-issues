import { useEffect } from 'react';
import { 
  Divider, 
  Typography, 
  Box, 
  TextField,
  Button
} from '@mui/material';

import { AppBar, CssBaseline, Toolbar } from '@mui/material';

import { Colors } from "../resources/Colors";
import { ChangePassword } from '../controllers/APIController';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../contexts/GlobalContext';
import { useState } from 'react';

export default function EditProfileForm() {
  const [state, dispatch] = useGlobal();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [token, setToken] = useState([]);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  useEffect(() => {
      setUser(state.user);
      setToken(state.token);
  }, [state.user, state.token])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === confirmedPassword)
    {
      try {
        console.log(oldPassword);
        console.log(newPassword);
        console.log(user.uid)
        const response = await ChangePassword(token, user.uid, oldPassword, newPassword);
        window.alert("Password has been changed!");
      } 
      catch (error) {
        window.alert("The old password is incorrect!");
      }
    }
    else
    {
      window.alert("Password do not match!");
    }
  };


  return (
    <div>
    <AppBar position="static" sx={{ maxHeight: 56.8, borderRadius: 1, bgcolor: Colors.primary }}>
                  <CssBaseline />
                  <Toolbar>
                      <Typography>
                          Edit Profile
                      </Typography>
                  </Toolbar>
              </AppBar>
    <Box
      component="form"
      onSubmit={handleSubmit} method="post"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      paddingTop= {5}
    >
        <p>
        <Typography
          sx={{ mt: 0.5, ml: 2 }}
          color="text.secondary"
          display="block"
          variant="caption"
        >
          User Info
        </Typography>
      </p>
      <div>
      <TextField
          disabled
          id="outlined-disabled"
          label="First Name"
          value={user.firstname}
        />
        <TextField
          disabled
          id="outlined-disabled"
          label="Last Name"
          value={user.lastname}
        />
    </div>
    <div>
    <TextField
          disabled
          id="outlined-disabled"
          label="Rank"
          value={user.rank}
        />
        <TextField
          disabled
          id="outlined-disabled"
          label="Role"
          value={user.role}
        />
    </div>

    <div>
    <Divider component="p" />
      <p>
        <Typography
          sx={{ mt: 0.5, ml: 2 }}
          color="text.secondary"
          display="block"
          variant="caption"
        >
          Change Password
        </Typography>
      </p>
        <TextField
            id="standard-password-input"
            label="Old Password"
            type="password"
            variant="standard"
            onChange={(e) => setOldPassword(e.target.value)}
          />
        <TextField
          id="standard-password-input"
          label="New Password"
          type="password"
          variant="standard"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          id="standard-password-input"
          label="Confirm Password"
          type="password"
          variant="standard"
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, bgcolor:  Colors.primary }}>
          Change Password
        </Button>
    </div>
    </Box>
    </div>
  );
}