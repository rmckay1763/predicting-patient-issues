import { useEffect, useState, Fragment } from 'react';
import { AddUser } from '../controllers/APIController';
import { useGlobal } from '../contexts/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { 
    Divider, 
    Box, 
    Autocomplete, 
    Stack, 
    Checkbox
} from '@mui/material';
import { 
    StyledTextField, 
    StyledButtonPrimary, 
    StyledButtonSecondary, 
    StyledTypography, 
    StyledFormControlLabel,
} from '../resources/StyledComponents';
import BaseToolbar from './BaseToolbar';
import { AlertError, AlertSuccess} from './AlertMessage';
import { Icons } from '../resources/Icons';

export default function AddUserForm() {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [rank, setRank] = useState(null);
    const [role, setRole] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    useEffect(() => {
      document.title = "PPCD Admin - New User";
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === confirmedPassword)
        {
            let userInfo = {
                firstname: firstname,
                lastname: lastname,
                username: username,
                rank: rank.id,
                role: role.id,
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

    const AddUserToolbar = () => (
        <BaseToolbar title="Add New User" >
            <StyledButtonSecondary 
                startIcon={Icons.close} 
                onClick={() => navigate("/users")}
            >
                Cancel
            </StyledButtonSecondary>
        </BaseToolbar>
    )

    const UserInfoFields = () => (
        <Stack spacing={2} direction="row">
            <StyledTextField
                required
                label="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <StyledTextField
                required
                label="First Name"
                onChange={(e) => setFirstname(e.target.value)}
            />
            <StyledTextField
                required
                label="Last Name"
                onChange={(e) => setLastname(e.target.value)}
            />
        </Stack>
    )

    const UserAttributeFields = () => (
        <Stack spacing={2} direction="row">
            <Autocomplete
                onChange={(event, newValue) => setRank(newValue)}
                options={state.ranks}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <StyledTextField required {...params} label="Rank" />}
            />
            <Autocomplete
                onChange={(event, newValue) => setRole(newValue)}
                options={state.roles}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <StyledTextField required {...params} label="Role" />}
            />
            <StyledFormControlLabel 
                control={<Checkbox onChange={(e) => setIsAdmin(e.target.checked)}/>} 
                label="Admin?" 
                sx={{}}
            />
        </Stack> 
    )

    const UserPasswordFields = () => (
        <Stack spacing={2} direction="row">
            <StyledTextField
                required
                label="Password"
                type="password"
                variant="standard"
                onChange={(e) => setPassword(e.target.value)}
            />
            <StyledTextField
                required
                label="Confirm Password"
                type="password"
                variant="standard"
                onChange={(e) => setConfirmedPassword(e.target.value)}
            />
            <StyledButtonPrimary startIcon={Icons.check} type="submit">
                Submit
            </StyledButtonPrimary>
        </Stack>
    )

    return (
        <Fragment>
            <AddUserToolbar />
            <Box
              component="form"
              onSubmit={handleSubmit} 
              method="post"
              sx={{'& .MuiTextField-root': { width: '25ch' }}}
              autoComplete="off"
              paddingTop= {3}
            >
                <Stack spacing={5} padding={3}>
                    <StyledTypography variant="subtitle1">User Info</StyledTypography>
                    {UserInfoFields()}
                    <Divider />
                    <StyledTypography variant="subtitle1">Attributes</StyledTypography>
                    {UserAttributeFields()}
                    <Divider />
                    <StyledTypography variant="subtitle1">Password</StyledTypography>
                    {UserPasswordFields()}
                </Stack>
            </Box>
        </Fragment>
    )
}
