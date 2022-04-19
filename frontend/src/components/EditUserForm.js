import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobal } from "../contexts/GlobalContext";

import { Divider, Box, Autocomplete  } from '@mui/material';
import { 
  StyledTextField, 
  StyledButtonPrimary, 
  StyledButtonSecondary, 
  StyledTypography, 
  StyledFormControlLabel
} from '../resources/StyledComponents';

import { Icons } from '../resources/Icons';
import { Colors } from '../resources/Colors';

import EditUserFormToolbar from "./EditUserFormToolbar";

export default function EditUserForm () {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const [user, setUser] = useState();

    const [username, setUsername] = useState();
    const [savedUsername, setSavedUsername] = useState();
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [rank, setRank] = useState();
    const [role, setRole] = useState();
    const [isAdmin, setIsAdmin] = useState();
    const [roleValue,setRoleValue] = useState();

    const [submit,setSubmit] = useState(false);
    const [deleteUser,setDeleteUser] = useState(false);
    const [deleteMessage,setDeleteMessage] = useState();

    const loadData = useCallback(async () => {
      let selected = state.users.find((user) => user.uid === location.state.uid);
      setUser(selected);
    }, [state, location.state]);

    // function setValues() {
    //   setUsername(user.username);
    //   setSavedUsername(username);
    //   setFirstname(user.firstname);
    //   setLastname(user.lastname);
    //   setRank(user.rank);
    //   setRole(user.role);
    //   setIsAdmin(user.admin);

    //   if (role === "NA") {
    //     setRoleValue(1);
    //   }
    //   if (role === "Surgery") {
    //     setRoleValue(2);
    //   }
    //   if (role === "Nurse") {
    //     setRoleValue(3);
    //   }

    //   let message = "Are you sure you want to remove the user " + 
    //       savedUsername +
    //       " and their associated records? This action cannot be undone.";
    //   setDeleteMessage(message);

    // }

    useEffect(() => {
      loadData();
      if (!user) return;
      document.title = ("PPCD - Edit User Records");
    }, [state, user, loadData]);

    if (!user) return <StyledTypography>loading data...</StyledTypography>;

    return (
      <div>
         <EditUserFormToolbar user={user} onSubmit={setSubmit} onDelete={setDeleteUser} />

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

        <Divider component="p" />

        <p>
        <StyledTypography sx={{ mt: 0.5, ml: 1 }} variant="subtitle1">
          Rank and Role
        </StyledTypography>
        </p>

        <Divider component="p" />

        <p>
        <StyledTypography sx={{ mt: 0.5, ml: 1 }} variant="subtitle1">
          Admin Status
        </StyledTypography>
        </p>

      </div>
    )
}

