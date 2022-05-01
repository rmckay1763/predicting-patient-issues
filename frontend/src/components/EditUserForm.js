import { useState, useEffect, useCallback, Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Divider, 
    Autocomplete, 
    Checkbox, 
    Stack,
} from '@mui/material';
import { 
    StyledButtonPrimary,
    StyledTextField, 
    StyledTypography, 
    StyledFormControlLabel,
} from '../resources/StyledComponents';
import { useGlobal } from "../contexts/GlobalContext";
import { DeleteUser, UpdateUser } from '../controllers/APIController';
import { ConfirmDialog } from "./Dialog";
import { AlertError, AlertSuccess } from "./AlertMessage";
import EditUserFormToolbar from "./EditUserFormToolbar";
import { Icons } from "../resources/Icons";

/**
 * @returns Component for an admin to edit a user's information.
 */
export default function EditUserForm () {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const [user, setUser] = useState();
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [rank, setRank] = useState(null);
    const [role, setRole] = useState(null);
    const [changeAdmin, setChangeAdmin] = useState(false);
    const [label, setLabel] = useState("");
    const [submit, setSubmit] = useState(false);
    const [submitMessage,setSubmitMessage] = useState("");
    const [deleteUser, setDeleteUser] = useState(false);
    const [deleteMessage,setDeleteMessage] = useState("");  
    const [dataLoaded, setDataLoaded] = useState(false);

    const resetInput = useCallback((selected) => {
      setUsername(selected.username);
      setLastname(selected.lastname);
      setFirstname(selected.firstname);
      setRank(selected.rank);
      setRole(selected.role);
      setChangeAdmin(false);
    }, [])

    useEffect(() => {
        if (dataLoaded) return;
        document.title = ("PPCD - Edit User Records");
        let selected = state.users.find((user) => user.uid === location.state.uid);
        if (!selected) return;
        setUser(selected);
        resetInput(selected)
        let message = "Are you sure you want to remove the user " + 
            selected.username +
            " and their associated records? This action cannot be undone.";
        setDeleteMessage(message);

        message = "Are you sure you want to update the user " + 
            selected.username +
            " and their associated records? This action cannot be undone.";
        setSubmitMessage(message);

        message = selected.admin ? "Revoke Admin Status" : "Grant Admin Status";
        setLabel(message);

        setDataLoaded(true)

    }, [state, location.state, dataLoaded, resetInput]);

    const onDelete = async() => {
        try {
            await DeleteUser(state.token, user.uid);
            AlertSuccess(dispatch, "User deleted");
            return navigate("/users")
        } catch (error) {
            console.error(error);
            AlertError(dispatch, "Failed to delete user");
        }
    }
    
    const submitUpdate = async() => {

        let isAdmin = changeAdmin ? !user.admin : user.admin;

        let updatedUser = {
            uid: user.uid,
            firstname: firstname,
            lastname: lastname,
            username: username,
            rank: rank.id,
            role: role.id,
            admin: isAdmin
        };

        try {
            var response = await UpdateUser(state.token, updatedUser);
            if (!response.data) {
                throw new Error("Empty reponse");
            } 
            let message = `User '${username}' has been updated!`;
            AlertSuccess(dispatch, message)
            return navigate("/users")
        } catch (error) {
            console.error(error);
            AlertError(dispatch, "Failed to update user info");
        }
    }

    const UserInfoFields = () => (
        <Stack spacing={2} direction="row">
            <StyledTextField
                required
                value={username}
                label="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <StyledTextField
                required
                value={firstname}
                label="First Name"
                onChange={(e) => setFirstname(e.target.value)}
            />
            <StyledTextField
                required
                value={lastname}
                label="Last Name"
                onChange={(e) => setLastname(e.target.value)}
            />
        </Stack>
    )

    const UserAttributeFields = () => (
        <Stack spacing={2} direction="row">
            <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={rank}
                onChange={(event, newValue) => setRank(newValue)}
                options={state.ranks}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <StyledTextField {...params} required label="Rank" />}
                sx={{width: "26ch"}}
            />
            <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={role}
                onChange={(event, newValue) => setRole(newValue)}
                options={state.roles}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <StyledTextField {...params} required label="Role" />}
                sx={{width: "26ch"}}
            />
            <StyledFormControlLabel 
                control={<Checkbox checked={changeAdmin} onChange={(e) => setChangeAdmin(e.target.value)}/>} 
                label={label} 
                sx={{}}
            />
        </Stack> 
    )

    const Actions = () => (
        <Stack spacing={2} direction="row">
            <StyledButtonPrimary 
                startIcon={Icons.check} 
                onClick={() => setSubmit(true)}
            >
                Submit
            </StyledButtonPrimary>
            <StyledButtonPrimary 
                startIcon={Icons.reset} 
                onClick={() => resetInput(user)}
            >
                Reset
            </StyledButtonPrimary>
        </Stack>
    )

    if (!user) return <StyledTypography>loading data...</StyledTypography>;

    return (
        <Fragment>
            <EditUserFormToolbar user={user} onSubmit={setSubmit} onDelete={setDeleteUser} />
            <Stack spacing={5} padding={3}>
                <StyledTypography variant="subtitle1">Update User Records</StyledTypography>
                <Divider />
                <StyledTypography variant="subtitle1">User Info</StyledTypography>
                {UserInfoFields()}
                <Divider />
                <StyledTypography variant="subtitle1">Attributes</StyledTypography>
                {UserAttributeFields()}
                <Divider />
                {Actions()}
            </Stack>
            <ConfirmDialog
                open={deleteUser}
                setOpen={setDeleteUser}
                onConfirm={onDelete}
                title="Confirmation Required"
                content={deleteMessage}
            />

            <ConfirmDialog
                open={submit}
                setOpen={setSubmit}
                onConfirm={submitUpdate}
                title="Confirmation Required"
                content={submitMessage}
            />

        </Fragment>
    )
}

