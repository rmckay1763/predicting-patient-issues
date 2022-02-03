import React, {
    useEffect,
    useState,
} from "react";
import { 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Box, 
    Card,
    CardActions, 
    CardContent,
    Grid, 
    Button, 
    IconButton, 
    Typography, 
    Divider, 
    AppBar, 
    Toolbar, 
    CssBaseline
} from "@mui/material";

import { Colors } from "../resources/Colors";
import { Icons } from "../resources/Icons";
import { useGlobal } from "../contexts/GlobalContext";

export default function NotificationPanel() {
    const [patients, setPatients] = useState([]);
    const [state, ] = useGlobal();

    useEffect(() => {
        setPatients(state.patients);
    }, [state.patients])

    return (
        <div>
        <AppBar position="static" sx={{ maxHeight: 56.8, borderRadius: 1, bgcolor: Colors.primary }}>
        <CssBaseline />
        <Toolbar>
            <Typography sx={{ paddingRight: 10 }}>
                Notifications
            </Typography>
            <FormControl variant="filled" size="small" sx={{ width: 200 }}>
                <InputLabel id="filter-notification-label">Filter By</InputLabel>
                <Select
                    labelId="filter-notification-label"
                    id="filter-notifcation-select"
                    label="Filter By"
                    defaultValue=""
                    //onChange={handleChange}
                >
                    <MenuItem value={"Condition Shift"}>Condition Shift</MenuItem>
                    <MenuItem value={"Vital Activity"}>Vital Activity</MenuItem>
                </Select>
            </FormControl>

        </Toolbar>
    </AppBar>
        <div style={{ backgroundColor: Colors.backgroundLight, maxHeight: "100vh", overflowX: "visible", overflowY: "scroll" }}>
            <Grid paddingLeft="45px" container spacing={4} justify="center" sx={{ maxWidth: 450 }} >
                {patients.map((el, i) => {
                    return (
                        <Grid key={i} item xs="auto" marginTop="20px">
                            <Card sx={{ minWidth: 275, maxWidth: 275}}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 14 }} color={Colors.primary} gutterBottom>
                                        {Icons.warning}
                                        <u>
                                            <strong>
                                                Condition Shift: {el.status}
                                            </strong>
                                        </u>
                                        <IconButton>
                                            {Icons.close}
                                        </IconButton>
                                    </Typography>
                                    <Divider />
                                    <Typography sx={{ mb: 1.5 }} color={Colors.primary}>
                                        Patient Name: {el.firstname} {el.lastname}
                                    </Typography>
                                </CardContent>
                                <Divider />
                                <CardActions style={{ float: "right" }}>
                                    <Button size="small" style={{ color: Colors.primary}}>Patient Profile</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
                <Grid item xs={12}>
                    <Box sx={{ width: 275, height: 200 }}></Box>
                </Grid>
            </Grid>
        </div>
        </div>
    )
}