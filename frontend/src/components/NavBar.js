import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Divider, 
  MenuItem, 
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";

import { Colors } from "../resources/Colors"
import { Icons } from "../resources/Icons"
import { useGlobal, Actions } from "../contexts/GlobalContext"
import DrawerComponent from "./Drawer";
import { StyledMenu } from "../resources/StyledComponents";

function Navbar(props) {
  const navigate = useNavigate();
  const [state, dispatch] = useGlobal();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [user, setUser] = useState([]);

  useEffect(() => {
      setUser(state.user);
  }, [state.user])


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const editProfile = () => {
    handleClose();
    return navigate("/editProfile");
  }

  const logout = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("user");
    dispatch({type: Actions.clearToken});
    dispatch({type: Actions.clearUser});
    return navigate("/login");
  };

  const ProfileMenu = () => (
    <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose} >
        <MenuItem className='NotClickable'>
            <ListItemIcon>{Icons.verifiedUser}</ListItemIcon>
            <ListItemText>{user.username}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={editProfile}>
            <ListItemIcon>{Icons.settings}</ListItemIcon>
            <ListItemText>Edit Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={logout}>
            <ListItemIcon>{Icons.logout}</ListItemIcon>
            <ListItemText>Logout</ListItemText>
        </MenuItem>
    </StyledMenu>
  )

  const AvatarButton = () => (
    <Button
    id="account-button"
    aria-controls={open ? 'account-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={open ? 'true' : undefined}
    variant="contained"
    disableElevation
    onClick={handleClick}
    style={{ backgroundColor: Colors.primary, }}
    sx={{
      '& .MuiAvatar-root': {
        backgroundColor: Colors.backgroundLighter,
        color:Colors.primary
      },
      '& :hover': {
        backgroundColor: Colors.secondary,
        color: Colors.primary,
      }
    }}
  >
    <Avatar src="/broken-image.jpg" />
  </Button>
  )

  return (
    <AppBar position="static" >
      
      <Toolbar style={{ background: Colors.primary, color: Colors.backgroundLighter }}>
      <DrawerComponent />
        <Box sx={{flexGrow: 1 }}>
        <Typography variant="h5">
          Predicting Patient Conditions Database
        </Typography>
        </Box>
        {AvatarButton()}
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;