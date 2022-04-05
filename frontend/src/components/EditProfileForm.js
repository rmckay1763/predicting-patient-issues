import { useEffect } from 'react';
import { 
  Divider, 
  Typography, 
  Box, 
  TextField,
  Button
} from '@mui/material';
import BaseToolbar from './BaseToolbar';
import { Colors } from "../resources/Colors";
import { ChangePassword, VerifyPassword } from '../controllers/APIController';
import { useGlobal } from '../contexts/GlobalContext';
import { useState } from 'react';
import { AlertSuccess, AlertError } from "./AlertMessage";

export default function EditProfileForm() {
  const [state, dispatch] = useGlobal();
  const [user, setUser] = useState(state.user);
  const [token, setToken] = useState(state.token);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  document.title = "PPCD - Edit Profile";

  useEffect(() => {
      setUser(state.user);
      setToken(state.token);
  }, [state.user, state.token])

  const handleSubmit = async (e) => {
      e.preventDefault();
      // old password to verify
      let old = {
          uid: user.uid,
          password: oldPassword
      }
      // new password to update
      let updated = {
          uid: user.uid,
          password: newPassword
      }
      // check if confirmed password is same as new password
      if (newPassword !== confirmedPassword) {
          AlertError(dispatch, "Passwords do not match!");
          return;
      }
      try {
          // verify old password first
          let response = await VerifyPassword(token, old);
          if (response.data == false) {
              AlertError(dispatch, "Failed to verify old password");
              return;
          }
          // update with new password
          response = await ChangePassword(token, updated);
          console.log(response.data)
          if (response.data) {
              AlertSuccess(dispatch, "Password has been changed!");
          } else {
            throw Error("Failed to update password")
          }
      } catch (error) {
          AlertError(dispatch, "Failed to update password");
          console.log(error.message);
      }
  };


  return (
    <div>
        <BaseToolbar title="Edit Profile" >
        </BaseToolbar>
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
          color="text.primary"
          display="block"
          variant="caption"
        >
          User Info
        </Typography>
      </p>
      <div>
      <TextField
          disabled
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
          label="Rank"
          value={user.rank.abbreviation}
        />
        <TextField
          disabled
          label="Role"
          value={user.role.name}
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
            label="Old Password"
            type="password"
            variant="standard"
            onChange={(e) => setOldPassword(e.target.value)}
          />
        <TextField
          label="New Password"
          type="password"
          variant="standard"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
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