import { Divider, Box, Autocomplete, Checkbox, MenuItem  } from '@mui/material';
import BaseToolbar from './BaseToolbar';
import { useState } from 'react';
import { AddUser } from '../controllers/APIController';
import { useGlobal } from '../contexts/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { 
  StyledTextField, 
  StyledButtonPrimary, 
  StyledButtonSecondary, 
  StyledTypography, 
  StyledFormControlLabel
} from '../resources/StyledComponents';
import { AlertError, AlertSuccess} from './AlertMessage';
import { Icons } from '../resources/Icons';
import { Colors } from '../resources/Colors';

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

        let rankVal = 0;
        for (let i = 0; i < 28; i++) {
          if (rank === ranks[i]) {
            rankVal = i + 1;
          }
        }

        if (password === confirmedPassword)
        {
            let userInfo = {
                firstname: firstname,
                lastname: lastname,
                username: username,
                rank: rankVal,
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
      <BaseToolbar title="Add New User" >
        <StyledButtonSecondary
          startIcon={Icons.close}
          onClick={() => navigate("/users")} 
        >
          Cancel
        </StyledButtonSecondary>
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
          required
          id="outlined-disabled"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <StyledTextField
          required
          id="outlined-disabled"
          label="First Name"
          onChange={(e) => setFirstname(e.target.value)}
        />
        <StyledTextField
          required
          id="outlined-disabled"
          label="Last Name"
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
      <div>
        <Divider component="p" />
        <p>
          <StyledTypography sx={{ mt: 0.5, ml: 1 }} variant="subtitle1">
            Attributes
          </StyledTypography>
        </p>
        <Autocomplete
          value={rank}
          onChange={(event, newValue) => {
            setRank(newValue);
          }}
          disablePortal
          id="Ranks"
          options={ranks}
          renderInput={(params) => <StyledTextField {...params} label="Rank" />}
        />
        <StyledTextField
          required  
          select
          id="outlined-disabled"
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value={1} style={{color: Colors.primary}}>
              NA
          </MenuItem>
          <MenuItem value={2} style={{color: Colors.primary}}>
              Surgery
          </MenuItem>
          <MenuItem value={3} style={{color: Colors.primary}}>
              Nurse
          </MenuItem>
        </StyledTextField>
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
          required
          id="standard-password-input"
          label="Password"
          type="password"
          variant="standard"
          onChange={(e) => setPassword(e.target.value)}
        />
        <StyledTextField
          required
          id="standard-password-input"
          label="Confirm Password"
          type="password"
          variant="standard"
          onChange={(e) => setConfirmedPassword(e.target.value)}
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

export const ranks = [
  'Civilian',
  'Other',
  'Seaman Recruit',
  'Seaman Apprentice',
  'Seaman',
  'Petty Officer Third Class',
  'Petty Officer Second Class',
  'Petty Officer First Class',
  'Chief Petty Officer',
  'Senior Chief Petty Officer',
  'Master Chief Petty Officer',
  'Command Master Chief Petty Officer',
  'Master Chief Petty Officer Of The Navy',
  'Chief Warrant Officer 2',
  'Chief Warrant Officer 3',
  'Chief Warrant Officer 4',
  'Chief Warrant Officer 5',
  'Ensign',
  'Lieutenant, Junior Grade',
  'Lieutenant',
  'Lieutenant Commander',
  'Commander',
  'Captain',
  'Rear Admiral Lower Half',
  'Rear Admiral Upper Half',
  'Vice Admiral',
  'Admiral',
  'Fleet Admiral'
];