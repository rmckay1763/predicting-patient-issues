import React, { useState } from "react";
import { 
    Drawer, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton 
} from "@mui/material";
import { Link } from "react-router-dom";
import { Colors } from "../resources/Colors";
import { Icons } from "../resources/Icons";

function DrawerComponent() {
const [openDrawer, setOpenDrawer] = useState(false);

    return (
        <>
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                classes = {{ paper: {overflowX: "hidden" }}}
            >
                <List>
                    <ListItem onClick={() => setOpenDrawer(false)}>
                        <ListItemText>
                            <Link style={{ color: Colors.primary }} to="/">Patients</Link>
                        </ListItemText>
                    </ListItem>
                </List>
            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                {Icons.menu}
            </IconButton>
        </>
    );
}
export default DrawerComponent;
