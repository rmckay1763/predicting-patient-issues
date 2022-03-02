import { Fragment, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Stack, IconButton } from "@mui/material"
import { AddVital } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import BaseToolbar from "./BaseToolbar";
import { 
    StyledFormControlLabel, 
    StyledTextField, 
    StyledButton, 
    StyledTypography 
} from "../resources/StyledComponents";
import { AlertSuccess, AlertError } from "./AlertMessage";
import { Icons } from "../resources/Icons";

/**
 * @returns Component to enter vitals
 */
export default function EnterVitals() {
    const navigate = useNavigate();
    const location = useLocation();
    const [state, dispatch] = useGlobal();
    const [heartRate, setHeartRate] = useState("");
    const [sao2, setSao2] = useState("");
    const [respiration, setRespiration] = useState("");
    const [heartRateError, setHeartRateError] = useState(false);
    const [sao2Error, setSao2Error] = useState(false);
    const [respirationError, setRespirationError] = useState(false);

    useEffect(() => {
        document.title = "PPCD - Enter Vitals";
    });

    const clearInput = () => {
        setHeartRate("");
        setSao2("");
        setRespiration("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let vital = {
            pid: location.state.patient.pid,
            heart_rate: heartRate,
            sao2: sao2,
            respiration: respiration
        }
        try {
            let response  = await AddVital(state.token, vital);
            if(!response.data) {
                throw new Error("Empty response");
            }
            AlertSuccess(dispatch, "Vitals successfully entered!");
            return navigate('/patientProfile', {state: {patient: location.state.patient}});
        } catch (error) {
            console.log(error);
            AlertError(dispatch, "Failed to insert vitals");
            clearInput();
        }
    }

    const handleCancel = () => {
        return navigate('/patientProfile', {state: {patient: location.state.patient}});
    }

    return (
        <Fragment>
            <BaseToolbar title="Enter Vitals">
            <StyledFormControlLabel 
                    control={<IconButton children={Icons.close} />}
                    label="Cancel"
                    onClick={handleCancel} />
            </BaseToolbar>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 5,
                    display: "flex",
                    justifyContent: "center",
                }}>
                <Stack spacing={2} >
                    <StyledTypography variant="subtitle1" textAlign="center">
                        Vital Information
                    </StyledTypography>
                    <StyledTextField
                        id="outlined-basic"
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        required
                        autoFocus
                        label="Heart rate"
                        value={heartRate}
                        error={heartRateError}
                        helperText={heartRateError ? "Heart rate must be positive." : ""}
                        onChange={(e) => {
                            setHeartRateError(e.target.value < 0);
                            setHeartRate(e.target.value);
                        }} />
                    <StyledTextField
                        id="outlined-basic"
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        label="SaO2"
                        value={sao2}
                        error={sao2Error}
                        helperText={sao2Error ? "SaO2 must be positive." : ""}
                        onChange={(e) => {
                            setSao2Error(e.target.value < 0);
                            setSao2(e.target.value);
                        }} />
                    <StyledTextField
                        id="outlined-basic"
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        label="Respiration"
                        value={respiration}
                        error={respirationError}
                        helperText={respirationError ? "Respiration must be positive." : ""}
                        onChange={(e) => {
                            setRespirationError(e.target.value < 0);
                            setRespiration(e.target.value);
                        }} />
                    <StyledButton type="submit">Submit</StyledButton>
                </Stack>
            </Box>
        </Fragment>
    )
}