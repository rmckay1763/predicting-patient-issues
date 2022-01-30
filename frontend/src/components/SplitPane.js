import React, {
    createRef,
    useContext,
    useEffect,
    useRef,
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
import SplitPaneContext from "../contexts/SplitPaneContext";
import EditProfileForm from "../components/EditProfileForm"
import PatientTable from "./PatientTable";
import { Colors } from "../resources/Colors";
import { Icons } from "../resources/Icons";

const SplitPane = ({ children, ...props }) => {
    const [clientHeight, setClientHeight] = useState(null);
    const [clientWidth, setClientWidth] = useState(null);
    const yDividerPos = useRef(null);
    const xDividerPos = useRef(null);

    const onMouseHoldDown = (e) => {
        yDividerPos.current = e.clientY;
        xDividerPos.current = e.clientX;
    };

    const onMouseHoldUp = () => {
        yDividerPos.current = null;
        xDividerPos.current = null;
    };

    const onMouseHoldMove = (e) => {
        if (!yDividerPos.current && !xDividerPos.current) {
            return;
        }

        setClientHeight(clientHeight + e.clientY - yDividerPos.current);
        setClientWidth(clientWidth + e.clientX - xDividerPos.current);

        yDividerPos.current = e.clientY;
        xDividerPos.current = e.clientX;
    };

    useEffect(() => {
        document.addEventListener("mouseup", onMouseHoldUp);
        document.addEventListener("mousemove", onMouseHoldMove);

        return () => {
            document.removeEventListener("mouseup", onMouseHoldUp);
            document.removeEventListener("mousemove", onMouseHoldMove);
        };
    });

    return (
        <div {...props}>
            <SplitPaneContext.Provider
                value={{
                    clientHeight,
                    setClientHeight,
                    clientWidth,
                    setClientWidth,
                    onMouseHoldDown,
                }}
            >
                {children}
            </SplitPaneContext.Provider>
        </div>
    );
};

export const DividerPane = (props) => {
    const { onMouseHoldDown } = useContext(SplitPaneContext);

    return <div {...props} onMouseDown={onMouseHoldDown} />;
};

export const SplitPaneTop = (props) => {
    const topRef = createRef();
    const { clientHeight, setClientHeight } = useContext(SplitPaneContext);
    const [patients, setPatients] = useState([])

    useEffect(() => {
        if (!clientHeight) {
            setClientHeight(topRef.current.clientHeight);
            return;
        }
        if (!topRef.current) return;
        topRef.current.style.minHeight = clientHeight + "px";
        topRef.current.style.maxHeight = clientHeight + "px";
    }, [clientHeight, setClientHeight, topRef]);

    useEffect(() => {
        setPatients(props.patients);
    }, [props])

    if (!patients) return null

    return (
        <div className="split-pane-top" ref={topRef} style={{ backgroundColor: Colors.backgroundLight, overflowX: "visible", overflowY: "scroll" }}>
            <Grid container spacing={12} justify="center" sx={{ maxWidth: 450, minHeight: 2000 }} >
                {patients.map((el, i) => {
                    return (
                        <Grid key={i} item xs="auto">
                            <Card sx={{ minWidth: 275, maxWidth: 275 }}>
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
                            <Box sx={{ width: 275, height: 15 }}></Box>
                        </Grid>
                    );
                })}
                <Grid item xs={12}>
                    <Box sx={{ width: 275, height: 200 }}></Box>
                </Grid>
            </Grid>
        </div>
    );
};

export const SplitPaneBottom = (props) => {
    
    return (
        <div></div>
    );
};

export const SplitPaneLeft = (props) => {
    const topRef = createRef();
    const { clientWidth, setClientWidth } = useContext(SplitPaneContext);

    useEffect(() => {
        if (!clientWidth) {
            setClientWidth(topRef.current.clientWidth / 2);
            return;
        }

        topRef.current.style.minWidth = clientWidth + "px";
        topRef.current.style.maxWidth = clientWidth + "px";
    }, [clientWidth, setClientWidth, topRef]);

        
    // const handleChange = (event) => {
        
    // };   


    return (<div {...props} className="split-pane-left" ref={topRef}>
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
        <SplitPane className="split-pane-col">
            <SplitPaneTop patients={props.patients} />
        </SplitPane>
    </div>);
};

export const SplitPaneRightPatientsTable = (props) => {
    useEffect(() => {
        document.title = "PPCD - Table";
    }, []);

    return (
        <div {...props} className="split-pane-right">
            <PatientTable />
        </div>
    );
};

export const SplitPaneRightEditProfile = (props) => {

    return (
        <div {...props} className="split-pane-right">
            <AppBar position="static" sx={{ maxHeight: 56.8, borderRadius: 1, bgcolor: Colors.primary }}>
                <CssBaseline />
                <Toolbar>
                    <Typography>
                        Edit Profile
                    </Typography>
                </Toolbar>
            </AppBar>
            <EditProfileForm />
        </div>
    );
};

export default SplitPane;