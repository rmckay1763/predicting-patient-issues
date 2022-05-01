import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    MenuItem, 
    Box, 
    Stack, 
} from "@mui/material";
import { UpdatePatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import { useComponentWidth } from "../contexts/Dimensions";
import BaseToolbar from "./BaseToolbar";
import {  
    StyledTextField, 
    StyledButtonPrimary, 
    StyledButtonSecondary,
    StyledIconButton,
    StyledTypography,
 } from "../resources/StyledComponents";
import { AlertSuccess, AlertError } from "./AlertMessage";
import { Colors } from "../resources/Colors";
import { Icons } from "../resources/Icons";

/**
 * @returns Component to edit a patient's information.
 */
export default function EditPatientForm() {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const patient = location.state.patient
    const [firstname, setFirstname] = useState(patient.firstname);
    const [lastname, setLastname] = useState(patient.lastname);
    const [age, setAge] = useState(patient.age);
    const [gender, setGender] = useState(patient.gender);
    const [ageError, setAgeError] = useState(false);

    useEffect(() => {
        document.title = "PPCD - Edit Patient Data";
    });

    const reset = () => {
        setFirstname(patient.firstname);
        setLastname(patient.lastname);
        setAge(patient.age);
        setGender(patient.gender);
    }

    const handleCancel = () => {
        navigate('/patientProfile', {state: {pid: patient.pid}});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let updated = structuredClone(patient);
        updated.status = patient.status.id;
        updated.firstname = firstname;
        updated.lastname = lastname;
        updated.age = age;
        updated.gender = gender;

        try {
            let response = await UpdatePatient(state.token, updated);
            if (!response.data) {
                throw new Error("Empty reponse");
            }
            AlertSuccess(dispatch, "Patient records updated successfully!");
            return navigate('/patientProfile', {state: {pid: patient.pid}});
        } catch (error) {
            AlertError(dispatch, "Failed to update patient records");
            reset();
            console.log(patient);
        }
    }

    const EditPatientToolbar = () => {
        const ref = useRef(null);
        const { width } = useComponentWidth(ref);
        const breakpoint = 600;
        const title = "Edit Patient Records";
        
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
            <EditPatientToolbar />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 5,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Stack spacing={2} padding={2} >
                    <StyledTypography variant="subtitle1" textAlign="center">
                        Updated Patient Information
                    </StyledTypography>
                    <StyledTextField
                        required
                        autoFocus
                        label="First name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)} />
                    <StyledTextField
                        required
                        label="Last name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)} />
                    <StyledTextField
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        required
                        label="Age"
                        value={age}
                        error={ageError}
                        helperText={ageError ? "Age must be positive." : ""}
                        onChange={(e) => {
                            setAgeError(e.target.value < 0);
                            setAge(e.target.value);
                        }} />
                    <StyledTextField
                        required
                        select
                        label="Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <MenuItem value={"Female"} style={{color: Colors.primary}}>
                            Female
                        </MenuItem>
                        <MenuItem value={"Male"} style={{color: Colors.primary}}>
                            Male
                        </MenuItem>
                    </StyledTextField>
                    <StyledButtonPrimary type="submit">Update Patient</StyledButtonPrimary>
                </Stack>
            </Box>
        </Fragment>
    )
}