import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  CssBaseline, 
  Typography, 
  Button, 
  Box, 
  Divider, 
  MenuItem, 
  Menu,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton 
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { StyledMenu } from "../resources/StyledComponents";
import { Colors } from "../resources/Colors"
import { Icons } from "../resources/Icons"
import { useGlobal, Actions } from "../contexts/GlobalContext"

// const StyledMenu = styled((props) => (
//   <Menu
//     elevation={0}
//     anchorOrigin={{
//       vertical: 'bottom',
//       horizontal: 'right',
//     }}
//     transformOrigin={{
//       vertical: 'top',
//       horizontal: 'right',
//     }}
//     {...props}
//   />
// ))(({ theme }) => ({
//   '& .MuiPaper-root': {
//     borderRadius: 6,
//     marginTop: theme.spacing(1),
//     minWidth: 180,
//     backgroundColor: Colors.backgroundLighter,
//     color:
//       theme.palette.mode === 'light' ? Colors.primary : theme.palette.grey[300],
//     '& .MuiMenuItem-root': {
//       '& .MuiSvgIcon-root': {
//         fontSize: 18,
//         color: Colors.primary,
//         marginRight: theme.spacing(1.5),
//       },
//       '&:active': {
//         backgroundColor: Colors.secondary
//       },
//       '&.Mui-disabled': {
//         color: Colors.primary,
//         opacity: 1
//       }
//     },
//   },
// }));

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

  const handleRefresh = () => {
    props.refresh();
  }

  const home = () => {
    return navigate("/");
  }

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
        <MenuItem>
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

  const NavButton = (props) => {
    return (
      <Box sx={{flexGrow: 1}} >
      <IconButton
        sx={{
          color: Colors.backgroundLighter, 
          '&:hover': { color: Colors.primary, background: Colors.secondary}
        }}
        onClick={props.handler}
      >
        {props.icon}
      </IconButton>
      </Box>
    )
  }

  return (
    <AppBar position="static" >
      <CssBaseline />
      <Toolbar style={{ background: Colors.primary, color: Colors.backgroundLighter }}>
        <Box sx={{flexGrow: 10 }}>
        <Typography variant="h5">
          Predicting Patient Conditions Database
        </Typography>
        </Box>
        <NavButton icon={Icons.home} handler={home} />
        <NavButton icon={Icons.refresh} handler={handleRefresh} />
        <Button
          id="account-button"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          style={{ background: Colors.primary, flexGrow: 1 }}
        >
          <Avatar src="/broken-image.jpg" />
        </Button>
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;