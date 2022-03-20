import { Divider, Box, } from '@mui/material';
import BaseToolbar from './BaseToolbar';
import { useState } from 'react';
import { Checkbox } from '@mui/material';
import { AddUser } from '../controllers/APIController';
import { useGlobal } from '../contexts/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { 
  StyledTextField, 
  StyledButtonPrimary, 
  StyledTypography, 
  StyledFormControlLabel
} from '../resources/StyledComponents';
import { AlertError, AlertSuccess} from './AlertMessage';

export default function AddUserForm() {
    const [state, dispatch] = useGlobal();
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
                let message = `User '${username}' has been created!`;
                AlertSuccess(dispatch, message)
                return navigate("/users")
            }
            catch (error) {
                AlertError(dispatch, "Creation of user failed!");
            }
        }
        else
        {
            AlertError(dispatch, "Passwords do not match!")
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
        <StyledTypography sx={{ mt: 0.5, ml: 1 }} variant="subtitle1">
          User Info
        </StyledTypography>
      </p>
      <div>
        <StyledTextField
          id="outlined-disabled"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <StyledTextField
          id="outlined-disabled"
          label="First Name"
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
        <StyledTextField
          id="outlined-disabled"
          label="Last Name"
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </div>
      <div>
        <Divider component="p" />
        <p>
          <StyledTypography sx={{ mt: 0.5, ml: 1 }} variant="subtitle1">
            Attributes
          </StyledTypography>
        </p>
        <StyledTextField
          id="outlined-disabled"
          label="Rank"
          onChange={(e) => setRank(e.target.value)}
          required
        />
        <StyledTextField
          id="outlined-disabled"
          label="Role"
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <StyledFormControlLabel 
          sx={{ mt: 2, ml: 4}} 
          control={<Checkbox onChange={(e) => setIsAdmin(e.target.checked)}/>} 
          label="Admin?" 
        />
      </div>
      <div>
        <Divider component="p" />
        <p>
          <StyledTypography sx={{ mt: 0.5, ml: 1 }} variant="subtitle1">
            Password
          </StyledTypography>
        </p>
        <StyledTextField
          id="standard-password-input"
          label="Password"
          type="password"
          variant="standard"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <StyledTextField
          id="standard-password-input"
          label="Confirm Password"
          type="password"
          variant="standard"
          onChange={(e) => setConfirmedPassword(e.target.value)}
          required
        />
        <StyledButtonPrimary 
          type="submit" 
          variant="contained" 
          sx={{ mt: 3, mb: 2 }}
        >
          Submit    
        </StyledButtonPrimary>
    </div>
    </Box>
    </div>
    )
}