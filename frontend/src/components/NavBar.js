import React from "react";
import DrawerComponent from "./Drawer"
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useTheme } from "@emotion/react";
import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { styled, alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from "@mui/material";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'

const useStyles = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(10),
    display: "flex",
  },
 logo: {
    flexGrow: "1",
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    marginLeft: theme.spacing(20),
    "&:hover": {
      color: "yellow",
      borderBottom: "1px solid white",
    },
  },
}));

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
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

function Navbar() {
  const classes = useStyles();
  const theme = useTheme();

  const { token, setToken } = useAuth();
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
    setToken(null);
    return navigate("/login");
  };

  return (
    <AppBar position="static" s>
      <CssBaseline />
      <Toolbar>
        <DrawerComponent />
        <Typography variant="h6" className={classes.logo}>
          Predicting Patient Conditions Database
        </Typography>
        <Button
          id="account-button"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
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
        <MenuItem disableRipple disabled={true}>
          <VerifiedUserIcon />
         Username 
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={editProfile} disableRipple>
          <SettingsIcon />
          Edit Profile
        </MenuItem>
        <MenuItem onClick={logout} disableRipple>
          <LogoutIcon />
          Logout
        </MenuItem>
      </StyledMenu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;