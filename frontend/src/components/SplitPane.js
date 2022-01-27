import React, {
    createRef,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import NotificationContext from "../contexts/NotificationContext";
import SplitPaneContext from "../contexts/SplitPaneContext";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from "@mui/material/Grid"
import Button from '@mui/material/Button';
import WarningIcon from '@mui/icons-material/Warning'
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton';
import { Colors } from "../config/colors";
import { AppBar, Toolbar } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { COLORS } from "../resources/Colors";
import EditProfileForm from "../components/EditProfileForm"
import PatientTable from "./PatientTable";

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
    </Box>
);

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
    const { patients } = useContext(NotificationContext);

    useEffect(() => {
        if (!clientHeight) {
            setClientHeight(topRef.current.clientHeight);
            return;
        }

        topRef.current.style.minHeight = clientHeight + "px";
        topRef.current.style.maxHeight = clientHeight + "px";
    }, [clientHeight]);

    return (
        <div className="split-pane-top" ref={topRef} style={{ overflowX: "hidden", overflowY: "scroll" }}>
            <Grid container spacing={12} justify="center" sx={{ maxWidth: 450, minHeight: 2000 }} >
                {patients.map((el,) => {
                    return (
                        <Grid item xs={12}>
                            <Card sx={{ minWidth: 275, maxWidth: 275 }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        <WarningIcon />
                                        <u>
                                            <strong>
                                                Condition Shift: {el.condition}
                                            </strong>
                                        </u>
                                        <IconButton>
                                            <CloseIcon />
                                        </IconButton>
                                    </Typography>
                                    <Divider />
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Patient Name: {el.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>
                                            {el.description}
                                        </strong>
                                    </Typography>
                                </CardContent>
                                <Divider />
                                <CardActions style={{ float: "right" }}>
                                    <Button size="small" style={{ color: COLORS.primary}}>Patient Profile</Button>
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
    }, [clientWidth]);

        
    const handleChange = (event) => {
        
      };   


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
                        onChange={handleChange}
                    >
                        <MenuItem value={"Condition Shift"}>Condition Shift</MenuItem>
                        <MenuItem value={"Vital Activity"}>Vital Activity</MenuItem>
                    </Select>
                </FormControl>

            </Toolbar>
        </AppBar>
        <SplitPane className="split-pane-col">
            <SplitPaneTop />
        </SplitPane>
    </div>);
};

export const SplitPaneRightPatientsTable = (props) => {
    useEffect(() => {
        document.title = "PPCD - Table";
    }, []);

    return (
        <div {...props} className="split-pane-right">
            <PatientTable patients={props.patients} vitals={props.vitals}/>
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