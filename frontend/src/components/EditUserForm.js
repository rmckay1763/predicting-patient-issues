import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobal } from "../contexts/GlobalContext";

import { Divider, Box, Autocomplete, Checkbox, MenuItem  } from '@mui/material';
import { 
  StyledTextField, 
  StyledTypography, 
  StyledFormControlLabel
} from '../resources/StyledComponents';

import { DeleteUser, UpdateUser } from '../controllers/APIController';
import ConfirmDialog from "./ConfirmDialog";
import { AlertError, AlertSuccess } from "./AlertMessage";

import { Colors } from '../resources/Colors';

import { ranks } from "./AddUserForm";  
import EditUserFormToolbar from "./EditUserFormToolbar";

export default function EditUserForm () {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const [user, setUser] = useState();
    const [token, setToken] = useState(state.token);

    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    
    const [rank, setRank] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [rankChange,setRankChange] = useState(false);
    const [roleValue,setRoleValue] = useState(1);

    const [isAdmin, setIsAdmin] = useState(false);
    const [changeAdmin, setChangeAdmin] = useState(false);
    
    const [label,setLabel] = useState("Change Admin Status for this User?");
    const [checkAdmin, setCheckAdmin] = useState(false);

    const [submit,setSubmit] = useState(false);
    const [submitMessage,setSubmitMessage] = useState("");

    const [deleteUser, setDeleteUser] = useState(false);
    const [deleteMessage,setDeleteMessage] = useState("");  

    const [dataLoaded, setDataLoaded] = useState(false);

    const loadData = useCallback(async () => {
      let selected = state.users.find((user) => user.uid === location.state.uid);
      setUser(selected);

      if (dataLoaded === false) {
        setValues();
      }

      setDataLoaded(true);
    }, [state, location.state, setValues]);

    function setValues () {

      setUsername(user.username);
      setLastname(user.lastname);
      setFirstname(user.firstname);
      setIsAdmin(user.admin);

      for (let i = 0; i < 28; i++) {
        if (user.rank.name === ranks[i]) {
          setRank(i + 1);
          setInputValue(ranks[i]);
        }
      }

      let message = "Are you sure you want to remove the user " + 
          user.username +
          " and their associated records? This action cannot be undone.";
      setDeleteMessage(message);

      message = "Are you sure you want to update the user " + 
          user.username +
          " and their associated records? This action cannot be undone.";
      setSubmitMessage(message);

      if (user.role.name === "NA") {
        setRoleValue(1);
      }
      if (user.role.name === "Surgery") {
        setRoleValue(2);
      }
      if (user.role.name === "Nurse") {
        setRoleValue(3);
      }

      let loggedUser = state.user;
      if (user.uid === loggedUser.uid) {
        setCheckAdmin(true);
        setLabel("You Do Not Have Permission to Change Admin Status.");
      }
    }

    useEffect(() => {
      loadData();
      if (!user) return;
      document.title = ("PPCD - Edit User Records");
    }, [state, user, loadData]);

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
      
      let rankValue = rank;
      if (rankChange === true) {
        for (let i = 0; i < 28; i++) {
          if (rank === ranks[i]) {
            rankValue = i + 1;
          }
        }
      }
      
      let admin = isAdmin;
      if (changeAdmin === true) {
        if (isAdmin === true) {
          admin = false;
        }
        else {
          admin = true;
        }
      }

      let updatedUser = {
        uid: user.uid,
        firstname: firstname,
        lastname: lastname,
        username: username,
        rank: rankValue,
        role: roleValue,
        admin: admin
      };

      try {
        var response = await UpdateUser(token, updatedUser);
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

    if (!user) return <StyledTypography>loading data...</StyledTypography>;

    return (
      <div>
         <EditUserFormToolbar user={user} onSubmit={setSubmit} onDelete={setDeleteUser} />

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
        <StyledTypography sx={{ mt: 0.5, ml: 1 }} variant="subtitle1">
          Update User Records
        </StyledTypography>
        </p>

        <Divider component="p" />

        <p>
        <StyledTypography sx={{ mt: 0.5, ml: 1 }} variant="subtitle1">
          User Info
        </StyledTypography>
        </p>

        <div>
        <StyledTextField
          required
          value={username}
          id="outlined-disabled"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <StyledTextField
          required
          value={firstname}
          id="outlined-disabled"
          label="First Name"
          onChange={(e) => setFirstname(e.target.value)}
        />
        <StyledTextField
          required
          value={lastname}
          id="outlined-disabled"
          label="Last Name"
          onChange={(e) => setLastname(e.target.value)}
        />
        </div>

        <Divider component="p" />

        <p>
        <StyledTypography sx={{ mt: 0.5, ml: 1 }} variant="subtitle1">
          Attributes
        </StyledTypography>
        </p>

        <Autocomplete
          value={inputValue}
          onChange={(event, newValue) => {
            setRank(newValue);
            setInputValue(newValue);
            setRankChange(true);
          }}
          disablePortal
          id="Ranks"
          options={ranks}
          renderInput={(params) => <StyledTextField {...params} label="Rank" />}
        />
        <StyledTextField
          required
          value={roleValue}
          select
          id="outlined-disabled"
          label="Role"
          onChange={(e) => setRoleValue(e.target.value)}
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
          control={<Checkbox disabled={checkAdmin} onChange={(e) => setChangeAdmin(e.target.checked)}/>} 
          label={label} 
        />

        </Box>

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

      </div>
    )
}

