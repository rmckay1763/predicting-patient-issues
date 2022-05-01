import { useEffect } from 'react';
import { 
  Divider, 
  Box, 
  Stack
} from '@mui/material';
import { StyledTypography, StyledTextField, StyledButtonPrimary } from '../resources/StyledComponents';
import BaseToolbar from './BaseToolbar';
import { ChangePassword, VerifyPassword } from '../controllers/APIController';
import { useGlobal } from '../contexts/GlobalContext';
import { useState } from 'react';
import { AlertSuccess, AlertError } from "./AlertMessage";

/**
 * @returns Component to for a user to edit their profile.
 */
export default function EditProfileForm() {
  const [state, dispatch] = useGlobal();
  const [user, setUser] = useState(state.user);
  const [token, setToken] = useState(state.token);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  document.title = "PPCD - View Profile";

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
          if (response.data === false) {
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
        <BaseToolbar title="View Profile" >
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
        <StyledTypography
          sx={{ mt: 0.5, ml: 2 }}
          color="text.primary"
          display="block"
          variant="subtitle1"
        >
          User Info
        </StyledTypography>
      </p>
      
      <Stack 
          divider={<Divider orientation="vertical" variant="middle" flexItem />}
          direction="row" 
          spacing={5}
          mt={3}
          mb={3}
      >
          <HeaderItem label="Username" value={user.username} />
          <HeaderItem label="First Name" value={user.firstname} />
          <HeaderItem label="Last Name" value={user.lastname} />
          <HeaderItem label="Rank" value={user.rank.name} />
          <HeaderItem label="Role" value={user.role.name} />
      </Stack>

    <div>
    <Divider component="p" />
      <p>
        <StyledTypography
          sx={{ mt: 0.5, ml: 2 }}
          color="text.secondary"
          display="block"
          variant="subtitle1"
        >
          Reset Password
        </StyledTypography>
      </p>
        <StyledTextField
            label="Old Password"
            type="password"
            variant="standard"
            onChange={(e) => setOldPassword(e.target.value)}
          />
        <StyledTextField
          label="New Password"
          type="password"
          variant="standard"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <StyledTextField
          label="Confirm Password"
          type="password"
          variant="standard"
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
        <StyledButtonPrimary type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Change Password
        </StyledButtonPrimary>
    </div>
    </Box>
    </div>
  );
}

/**
 * @props {string} label -- Label for the item
 * @props {string} value -- Value for the item
 * @returns Header item for the patient profile page
 */
 const HeaderItem = (props) => {
  const [value, setValue] = useState("");

  useEffect(() => {
      setValue(props.value)
  }, [props.value])

  return (
      <Box display="flex">
          <StyledTypography
              variant="subtitle1"
              sx={{
                  fontWeight: 600,
                  ml: 2
              }}
          >
              {props.label}: 
          </StyledTypography>
          <StyledTypography
              variant="subtitle1"
              sx={{
                  ml: 2
              }}
          >
              {value}
          </StyledTypography>
      </Box>
  )
}