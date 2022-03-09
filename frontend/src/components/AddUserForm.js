import { 
  Divider, 
  Typography, 
  Box, 
  TextField,
  Button
} from '@mui/material';
import BaseToolbar from './BaseToolbar';
import { Colors } from "../resources/Colors";
import { useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { AddUser } from '../controllers/APIController';
import { useGlobal } from '../contexts/GlobalContext';
import { useNavigate } from 'react-router-dom';

export default function AddUserForm() {
    const [state,] = useGlobal();
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [rank, setRank] = useState("");
    const [role, setRole] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const navigate = useNavigate();
  
    document.title = "PPCD Admin - New User";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password === confirmedPassword)
        {
            let userInfo = {
                firstname: firstname,
                lastname: lastname,
                username: username,
                rank: rank,
                role: role,
                admin: isAdmin,
                password: password
            }
            try {
                var response = await AddUser(state.token, userInfo);
                if (!response.data) {
                    throw new Error("Empty reponse");
                } 
                window.alert(`User '${username}' has been created!`);
                return navigate("/users")
            }
            catch (error) {
                window.alert("Creation of user failed!")
            }
        }
        else
        {
            window.alert("Passwords do not match!");
        }
    }

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
          color="text.secondary"
          display="block"
          variant="caption"
        >
          User Info
        </Typography>
      </p>
      <div>
      <TextField
          id="outlined-disabled"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      <TextField
          id="outlined-disabled"
          label="First Name"
          onChange={(e) => setFirstname(e.target.value)}
        />
        <TextField
          id="outlined-disabled"
          label="Last Name"
          onChange={(e) => setLastname(e.target.value)}
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
          Attributes
        </Typography>
      </p>
    <TextField
          id="outlined-disabled"
          label="Rank"
          onChange={(e) => setRank(e.target.value)}
        />
        <TextField
          id="outlined-disabled"
          label="Role"
          onChange={(e) => setRole(e.target.value)}
        />
        <FormControlLabel sx={{ mt: 2, ml: 4}} control={<Checkbox onChange={(e) => setIsAdmin(e.target.checked)}/>} label="Admin?" />
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
          Password
        </Typography>
      </p>
        <TextField
          id="standard-password-input"
          label="Password"
          type="password"
          variant="standard"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          id="standard-password-input"
          label="Confirm Password"
          type="password"
          variant="standard"
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, bgcolor:  Colors.primary }}>
            Submit    
        </Button>
    </div>
    </Box>
    </div>
    )
}