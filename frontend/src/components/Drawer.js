import React, { useState } from "react";
import { 
    Drawer, 
    ListItem, 
    ListItemText, 
    ListItemIcon,
    IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { StyledList } from "../resources/StyledComponents";
import { Colors } from "../resources/Colors";
import { Icons } from "../resources/Icons";
import { useGlobal } from "../contexts/GlobalContext";

function DrawerComponent() {
const [openDrawer, setOpenDrawer] = useState(false);

    const AdminListItem = () => {
        const [state,] = useGlobal();

        if (state.user.admin) {
            return (
                <ListItem 
                    button 
                    onClick={() => setOpenDrawer(false)}
                    component={Link} 
                    to="/users"
                >
                    <ListItemIcon>{Icons.admin}</ListItemIcon>
                    <ListItemText>Manage Users</ListItemText>
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

    const GenericListItem = (props) => (
        <ListItem
            button 
            onClick={() => setOpenDrawer(false)}
            component={Link}
            to={props.to}
        >
            <ListItemIcon>{props.icon}</ListItemIcon>
            <ListItemText>{props.text}</ListItemText>
        </ListItem>
    )

    return (
        <>
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                classes = {{ paper: {overflowX: "hidden"} }}
                sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: Colors.backgroundLighter
                    }
                }}
            >
                <StyledList>
                    <GenericListItem 
                        to='/'
                        icon={Icons.home}
                        text='Patient Home' />
                    <GenericListItem 
                        to='/newPatient'
                        icon={Icons.addPerson}
                        text='Add Patient' />
                    <AdminListItem />
                </StyledList>
            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                {Icons.menu}
            </IconButton>
        </>
    );
}
export default DrawerComponent;
