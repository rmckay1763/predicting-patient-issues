import { Divider, Box, Autocomplete  } from '@mui/material';
import BaseToolbar from './BaseToolbar';
import { useState, useEffect } from 'react';
import { Checkbox } from '@mui/material';
import { UpdateUser } from '../controllers/APIController';
import { useGlobal } from '../contexts/GlobalContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  StyledTextField, 
  StyledButtonPrimary, 
  StyledButtonSecondary, 
  StyledTypography, 
  StyledFormControlLabel
} from '../resources/StyledComponents';
import { MenuItem } from "@mui/material";
import { AlertError, AlertSuccess} from './AlertMessage';
import { Icons } from '../resources/Icons';
import { Colors } from '../resources/Colors';

export default function EditUserForm() {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const [user, setUser] = useState(state.user);
    const [token, setToken] = useState(state.token);

    const [username, setUsername] = useState(user.username);
    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [rank, setRank] = useState(user.rank);
    const [role, setRole] = useState(user.role);
    const [isAdmin, setIsAdmin] = useState(user.admin);
    document.title = "PPCD Admin - Edit User";
    
    useEffect(() => {
      setUser(state.user);
      setToken(state.token);
    }, [state.user, state.token])

    const handleSubmit = async (e) => {
        e.preventDefault();
        let user = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            rank: rank.id,
            role: role,
            admin: isAdmin
        }
        try {
            var response = await UpdateUser(state.token, user);
            if (!response.data) {
                throw new Error("Empty reponse");
            } 
            let message = `User '${username}' has been updated!`;
            AlertSuccess(dispatch, message)
            return navigate("/users")
        }
        catch (error) {
            AlertError(dispatch, "Update of user failed!");
        }
    }

    return (
      <div>
      <BaseToolbar title="Edit User" >
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
          autoFocus
          id="outlined-disabled"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <StyledTextField
          value={firstname}
          required
          id="outlined-disabled"
          label="First Name"
          onChange={(e) => setFirstname(e.target.value)}
        />
        <StyledTextField
          value={lastname}
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
            Current User Info:
          </StyledTypography>
        </p>
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

const ranks = [
  { id: 1, label: 'Civilian'},
  { id: 2, label: 'Other'},
  { id: 3, label: 'Seaman Recruit'},
  { id: 4, label: 'Seaman Apprentice'},
  { id: 5, label: 'Seaman'},
  { id: 6, label: 'Petty Officer Third Class'},
  { id: 7, label: 'Petty Officer Second Class'},
  { id: 8, label: 'Petty Officer First Class'},
  { id: 9, label: 'Chief Petty Officer'},
  { id: 10, label: 'Senior Chief Petty Officer'},
  { id: 11, label: 'Master Chief Petty Officer'},
  { id: 12, label: 'Command Master Chief Petty Officer'},
  { id: 13, label: 'Master Chief Petty Officer Of The Navy'},
  { id: 14, label: 'Chief Warrant Officer 2'},
  { id: 15, label: 'Chief Warrant Officer 3'},
  { id: 16, label: 'Chief Warrant Officer 4'},
  { id: 17, label: 'Chief Warrant Officer 5'},
  { id: 18, label: 'Ensign'},
  { id: 19, label: 'Lieutenant, Junior Grade'},
  { id: 20, label: 'Lieutenant'},
  { id: 21, label: 'Lieutenant Commander'},
  { id: 22, label: 'Captain'},
  { id: 23, label: 'Rear Admiral Lower Half'},
  { id: 24, label: 'Rear Admiral Upper Half'},
  { id: 25, label: 'Vice Admiral'},
  { id: 26, label: 'Admiral'},
  { id: 27, label: 'Fleet Admiral'},
];
