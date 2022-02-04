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
  Avatar 
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import DrawerComponent from "./Drawer"
import { Colors } from "../resources/Colors"
import { Icons } from "../resources/Icons"
import { useGlobal, Actions } from "../contexts/GlobalContext"

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
    color:
      theme.palette.mode === 'light' ? Colors.primary : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: Colors.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          Colors.primary,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

function Navbar() {
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

  const handleRefresh = () => {
    window.location.reload(false);
  }

  const logout = () => {
    localStorage.removeItem("uid");
    dispatch({type: Actions.clearToken})
    dispatch({type: Actions.clearUser})
    return navigate("/login");
  };

  return (
    <AppBar position="static" style={{ background: Colors.primary }}s>
      <CssBaseline />
      <Toolbar>
        <DrawerComponent />
        <Box sx={{flexGrow: 1, cursor: 'pointer'}}>
        <Typography variant="h6">
          Predicting Patient Conditions Database
        </Typography>
        </Box>
        <Button
          id="refresh-button"
          variant="contained"
          disableElevation
          onClick={handleRefresh}
          style={{ background: Colors.primary }}
        >
          {Icons.refresh}
        </Button>
        <Button
          id="account-button"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          style={{ background: Colors.primary }}
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
        <MenuItem disableRipple>
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