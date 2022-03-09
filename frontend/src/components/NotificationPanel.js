import React, { useEffect, useState, useRef, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Box, 
    Card,
    Stack,
    CardActions, 
    CardContent,
    Button,  
    Typography, 
    Divider, 
} from "@mui/material";
import BaseToolbar from "./BaseToolbar";
import { Colors } from "../resources/Colors";
import { Icons, IconsLarge } from "../resources/Icons";
import { useGlobal } from "../contexts/GlobalContext";
import { useComponentWidth } from "../contexts/Dimensions";
import { StyledFormControlLabel, StyledSwitch } from "../resources/StyledComponents";

/**
 * @returns Notification panel for split pane view.
 */
export default function NotificationPage() {
    const [state, ] = useGlobal();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [criticalOnly, setCriticalOnly] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = Colors.backgroundLight
        let temp = state.patients;
        temp.sort((a, b) => a.status.id - b.status.id);
        if (criticalOnly) {
            temp = temp.filter((patient) => {
                return patient.status.text === 'Critical';
            });
        }
        setPatients(temp);
    }, [state.patients, criticalOnly]);

    const onCriticalOnlyChanged = (event) => {
        setCriticalOnly(event.target.checked);
    }

    const NotificationToolbar = () => {
        const ref = useRef(null);
        const { width } = useComponentWidth(ref);
        const unlabeledSwitch = (
            <StyledSwitch 
                className='CustomSwitch' 
                checked={criticalOnly} 
                onChange={onCriticalOnlyChanged} />
        )
        const labeledSwitch = (
            <StyledFormControlLabel 
                control={unlabeledSwitch}
                label={"Critical Only"}
                onChange={onCriticalOnlyChanged} />
        )
        const title = width < 500 ? IconsLarge.notification : 'Notifications'
        const criticalOnlySwitch = width < 250 ? unlabeledSwitch : labeledSwitch

        return (
            <BaseToolbar title={title} ref={ref} >
                {criticalOnlySwitch}
            </BaseToolbar>
        )
    }

    const NotificationButton = ({patient}) => (
        <Button
            onClick={() => navigate('/patientProfile', {state: {patient: patient}})}
            size='small'
            sx={{
                color: Colors.primary,
                backgroundColor: Colors.backgroundLighter,
                '&:hover': {
                    color: Colors.primary,
                    backgroundColor: Colors.secondary
                }
            }}
        >
            View Profile
        </Button>
    )

    const NotificationStatus = ({patient}) => {
        let critical = patient.status.text === 'Critical';
        return (
            <Stack 
                direction='row' 
                spacing={2} 
                sx={{color: critical ? Colors.alert : Colors.primary}} 
            >
                <Box sx={{flexGrow: 1 }}>
                    {critical ? Icons.warning : Icons.stable}
                </Box>
                <Typography sx={{fontWeight: 600}}>
                    Status: {patient.status.text}
                </Typography>
            </Stack>
        )
    }

    const NotificationCard = (patient, index) => (
        <Card 
            key={index}
            sx={{
                backgroundColor: Colors.backgroundLighter, 
                color: Colors.primary,
            }}
        >
            <CardContent>
                <Stack spacing={1} divider={<Divider flexItem />} >
                    <NotificationStatus patient={patient} />
                    <Typography align='right'>
                        Patient Name: {patient.firstname} {patient.lastname}
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions style={{ float: "right" }}>
                <NotificationButton patient={patient}/>
            </CardActions>
        </Card>
    )

    return (
        <Fragment>
            <NotificationToolbar />
            <Box 
                sx={{
                    mt: 5,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Stack spacing={4} padding={2}>
                    {patients.map(NotificationCard)}
                </Stack>
            </Box>
        </Fragment>
    )
}