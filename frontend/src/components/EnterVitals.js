import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Stack } from "@mui/material"
import { AddVital } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import { useComponentWidth } from "../contexts/Dimensions";
import BaseToolbar from "./BaseToolbar";
import {  
    StyledTextField, 
    StyledButtonPrimary,
    StyledButtonSecondary, 
    StyledTypography, 
    StyledIconButton
} from "../resources/StyledComponents";
import { AlertSuccess, AlertError } from "./AlertMessage";
import { Icons } from "../resources/Icons";

/**
 * @returns Component to enter vitals.
 */
export default function EnterVitals() {
    const navigate = useNavigate();
    const location = useLocation();
    const patient = location.state.patient;
    const [state, dispatch] = useGlobal();
    const [heartRate, setHeartRate] = useState("");
    const [sao2, setSao2] = useState("");
    const [respiration, setRespiration] = useState("");
    const [cvp, setCvp] = useState("");
    const [systolic, setSystolic] = useState("");
    const [diastolic, setDiastolic] = useState("");
    const [temperature, setTemperature] = useState("");
    const [icp, setIcp] = useState("");
    const [heartRateError, setHeartRateError] = useState(false);
    const [sao2Error, setSao2Error] = useState(false);
    const [respirationError, setRespirationError] = useState(false);
    const [cvpError, setCvpError] = useState(false);
    const [systolicError, setSystolicError] = useState(false);
    const [diastolicError, setDiastolicError] = useState(false);
    const [temperatureError, setTemperatureError] = useState(false);
    const [icpError, setIcpError] = useState(false);

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
            pid: patient.pid,
            heart_rate: heartRate,
            sao2: sao2,
            respiration: respiration,
            cvp: cvp,
            systolic: systolic,
            diastolic: diastolic,
            temperature: temperature,
            icp: icp
        }
        try {
            let response  = await AddVital(state.token, vital);
            if(!response.data) {
                throw new Error("Empty response");
            }
            AlertSuccess(dispatch, "Vitals successfully entered!");
            return navigate('/patientProfile', {state: {pid: patient.pid}});
        } catch (error) {
            console.log(error);
            AlertError(dispatch, "Failed to insert vitals");
            clearInput();
        }
    }

    const handleCancel = () => {
        return navigate('/patientProfile', {state: {pid: patient.pid}});
    }

    const EnterVitalsToolbar = () => {
        const ref = useRef(null);
        const { width } = useComponentWidth(ref);
        const breakpoint = 600;
        const title = 'Enter Vitals: ' + patient.firstname + ' ' + patient.lastname;
        
        const full = () => (
            <BaseToolbar title={title} ref={ref} >
                <StyledButtonSecondary
                        startIcon={Icons.close}
                        onClick={handleCancel} 
                >
                    Cancel
                </StyledButtonSecondary>
            </BaseToolbar>
        )
    
        const reduced = () => (
            <BaseToolbar title={title} ref={ref} >
                <StyledIconButton onClick={handleCancel}>
                    {Icons.close}
                </StyledIconButton>
            </BaseToolbar>
        )
    
        return width < breakpoint ? reduced() : full();
    }

    return (
        <Fragment>
            <EnterVitalsToolbar />
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
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        required
                        label="SaO2"
                        value={sao2}
                        error={sao2Error}
                        helperText={sao2Error ? "SaO2 must be positive." : ""}
                        onChange={(e) => {
                            setSao2Error(e.target.value < 0);
                            setSao2(e.target.value);
                        }} />
                    <StyledTextField
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        required
                        label="Respiration"
                        value={respiration}
                        error={respirationError}
                        helperText={respirationError ? "Respiration must be positive." : ""}
                        onChange={(e) => {
                            setRespirationError(e.target.value < 0);
                            setRespiration(e.target.value);
                        }} />
                    <StyledTextField
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        required
                        label="CVP"
                        value={cvp}
                        error={cvpError}
                        helperText={cvpError ? "CVP must be positive." : ""}
                        onChange={(e) => {
                            setCvpError(e.target.value < 0);
                            setCvp(e.target.value);
                        }} />
                    <StyledTextField
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        required
                        label="Systolic"
                        value={systolic}
                        error={systolicError}
                        helperText={systolicError ? "Systolic must be positive." : ""}
                        onChange={(e) => {
                            setSystolicError(e.target.value < 0);
                            setSystolic(e.target.value);
                        }} />
                    <StyledTextField
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        required
                        label="Diastolic"
                        value={diastolic}
                        error={diastolicError}
                        helperText={diastolicError ? "Diastolic must be positive." : ""}
                        onChange={(e) => {
                            setDiastolicError(e.target.value < 0);
                            setDiastolic(e.target.value);
                        }} />
                    <StyledTextField
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        required
                        label="Temperature (Celcius)"
                        value={temperature}
                        error={temperatureError}
                        helperText={temperatureError ? "Temperature must be positive." : ""}
                        onChange={(e) => {
                            setTemperatureError(e.target.value < 0);
                            setTemperature(e.target.value);
                        }} />
                    <StyledTextField
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        required
                        label="ICP"
                        value={icp}
                        error={icpError}
                        helperText={icpError ? "ICP must be positive." : ""}
                        onChange={(e) => {
                            setIcpError(e.target.value < 0);
                            setIcp(e.target.value);
                        }} />
                    <StyledButtonPrimary type="submit">Submit</StyledButtonPrimary>
                </Stack>
            </Box>
        </Fragment>
    )
}