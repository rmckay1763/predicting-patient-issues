import { useEffect } from 'react';
import { 
  Divider, 
  Typography, 
  Box, 
  TextField 
} from '@mui/material';

export default function EditProfileForm() {
  
  useEffect(() => {
    document.title = "PPCD - Edit Profile";  
  }, []);

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