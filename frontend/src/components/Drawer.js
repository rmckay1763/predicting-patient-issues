import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
 makeStyles
} from "@material-ui/core";
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { COLORS } from "../resources/Colors";

const useStyles = makeStyles(()=>({
  paper: {
    overflowX: "hidden"
  }
}));

function DrawerComponent() {
const classes = useStyles();
const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        classes = {{ paper: classes.paper }}
      >
        <List>
         <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link style={{ color: COLORS.primary }} to="/">Patients</Link>
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon />
      </IconButton>
    </>
  );
}
export default DrawerComponent;
