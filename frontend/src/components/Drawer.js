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
import { useGlobal } from "../contexts/GlobalContext";

function AdminListItem() {
    const [state,] = useGlobal();

    if (state.user.admin) {
        return (
            <ListItem>
                <ListItemText>
                    <Link style={{ color: Colors.primary }} to="/users">Users</Link>
                </ListItemText>
            </ListItem>
        )
    }
    else {
        return (
            <div>
            </div>
        )
    }
}

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
                    <AdminListItem />
                </List>
            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                {Icons.menu}
            </IconButton>
        </>
    );
}
export default DrawerComponent;
