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
import { Icons, IconsLarge } from "../resources/Icons";
import { useGlobal } from "../contexts/GlobalContext";
import { useViewport } from "../contexts/Dimensions"

export default function DrawerComponent() {
    
    const [openDrawer, setOpenDrawer] = useState(false);
    const { width } = useViewport();
    const breakpoint = 900;
    const [state,] = useGlobal();

    const DrawerListItem = (props) => (
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
                sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: Colors.backgroundLighter
                    }
                }}
            >
                <StyledList>
                    <DrawerListItem 
                        to='/'
                        icon={Icons.home}
                        text='Patient Home' />
                    <DrawerListItem 
                        to='/newPatient'
                        icon={Icons.addPerson}
                        text='Add Patient' />
                    {width < breakpoint && 
                        <DrawerListItem 
                            to='/notifications' 
                            icon={Icons.notification} 
                            text='Notifications' />
                    }
                    {state.user.admin && 
                        <DrawerListItem 
                            to="/users"
                            icon={Icons.admin} 
                            text='Manage Users' />
                    }
                    {state.user.admin && 
                        <DrawerListItem 
                            to="/roles"
                            icon={Icons.admin} 
                            text='Manage Roles' />
                    }
                </StyledList>
            </Drawer>
            <IconButton 
                onClick={() => setOpenDrawer(!openDrawer)}
                sx={{
                    color: Colors.backgroundLighter,
                    '& :hover': {
                        backgroundColor: Colors.secondary,
                        color: Colors.primary
                    }
                }} >
                {IconsLarge.menu}
            </IconButton>
        </>
    );
}
