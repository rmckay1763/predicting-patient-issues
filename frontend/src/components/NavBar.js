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
  Avatar,
  IconButton 
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { Colors } from "../resources/Colors"
import { Icons } from "../resources/Icons"
import { useGlobal, Actions } from "../contexts/GlobalContext"
import { useNavigator, Destinations } from "../contexts/Navigator";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    backgroundColor: Colors.backgroundLighter,
    color:
      theme.palette.mode === 'light' ? Colors.primary : theme.palette.grey[300],
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: Colors.primary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: Colors.secondary
      },
      '&.Mui-disabled': {
        color: Colors.primary,
        opacity: 1
      }
    },
  },
}));

function Navbar(props) {
  const navigate = useNavigate();
  const [, navigator] = useNavigator();
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
    navigator(Destinations.patientTable);
  }

  const editProfile = () => {
    handleClose();
    navigator(Destinations.editProfile);
  }

  const logout = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("user");
    dispatch({type: Actions.clearToken});
    dispatch({type: Actions.clearUser});
    return navigate("/login");
  };

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
        <StyledMenu
          id="account-menu"
          MenuListProps={{
            'aria-labelledby': 'account-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
        <MenuItem disableRipple disabled>
          {Icons.verifiedUser}
          {user.username}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={editProfile} disableRipple>
          {Icons.settings}
          Edit Profile
        </MenuItem>
        <MenuItem onClick={logout} disableRipple>
          {Icons.logout}
          Logout
        </MenuItem>
      </StyledMenu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;