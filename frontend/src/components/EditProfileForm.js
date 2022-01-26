import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Divider, Typography } from '@mui/material';

export default function EditProfileForm() {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      paddingTop= {5}
    >
        <li>
        <Typography
          sx={{ mt: 0.5, ml: 2 }}
          color="text.secondary"
          display="block"
          variant="caption"
        >
          User Info
        </Typography>
      </li>
      <div>
      <TextField
          disabled
          id="outlined-disabled"
          label="First Name"
          defaultValue="Hello"
        />
        <TextField
          disabled
          id="outlined-disabled"
          label="Last Name"
          defaultValue="World"
        />
    </div>
    <div>
    <TextField
          disabled
          id="outlined-disabled"
          label="Rank"
          defaultValue="Rank"
        />
        <TextField
          disabled
          id="outlined-disabled"
          label="Role"
          defaultValue="Role"
        />
    </div>

    <div>
    <Divider component="li" />
      <li>
        <Typography
          sx={{ mt: 0.5, ml: 2 }}
          color="text.secondary"
          display="block"
          variant="caption"
        >
          Change Password
        </Typography>
      </li>
        <TextField
          id="standard-password-input"
          label="Old Password"
          type="password"
          variant="standard"
        />
        <TextField
          id="standard-password-input"
          label="New Password"
          type="password"
          variant="standard"
        />
        <TextField
          id="standard-password-input"
          label="Confirm Password"
          type="password"
          variant="standard"
        />
    </div>
    </Box>
  );
}