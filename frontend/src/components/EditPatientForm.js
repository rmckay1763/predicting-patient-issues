import { Fragment, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    MenuItem, 
    Box, 
    Stack, 
    IconButton 
} from "@mui/material";
import { UpdatePatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import BaseToolbar from "./BaseToolbar";
import { 
    StyledFormControlLabel, 
    StyledTextField, 
    StyledButtonPrimary, 
    StyledTypography,
 } from "../resources/StyledComponents";
import { AlertSuccess, AlertError } from "./AlertMessage";
import { Colors } from "../resources/Colors";
import { Icons } from "../resources/Icons";

/**
 * @returns Component to add a patient.
 */
export default function AddPatientForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [state, dispatch] = useGlobal();
    const [firstname, setFirstname] = useState(location.state.patient.firstname);
    const [lastname, setLastname] = useState(location.state.patient.lastname);
    const [age, setAge] = useState(location.state.patient.age);
    const [gender, setGender] = useState(location.state.patient.gender);
    const [ageError, setAgeError] = useState(false);

    useEffect(() => {
        document.title = "PPCD - Edit Patient Data";
    });

    function mapStatus(status) {
        switch (status) {
            case 'Critical':
                return 0;
            case 'Stable':
                return 9;
            case 'Unobserved':
                return 10;
            default:
                break;
        }
    }

    const clearInput = () => {
        setFirstname("");
        setLastname("");
        setAge("");
        setGender("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let patient = location.state.patient;
        patient.age = age;
        patient.firstname = firstname;
        patient.lastname = lastname;
        patient.gender = gender;
        patient.status = mapStatus(patient.status);

        try {
            let response = await UpdatePatient(state.token, patient);
            if (!response.data) {
                throw new Error("Empty reponse");
            }
            AlertSuccess(dispatch, "Patient records updated successfully!");
            return navigate('/patientProfile', {state: {patient: location.state.patient}});
        } catch (error) {
            AlertError(dispatch, "Failed to update patient records");
            clearInput();
        }
    }

    return (
        <Fragment>
            <BaseToolbar title="Edit Patient Records">
                <StyledFormControlLabel 
                    control={<IconButton children={Icons.close} />}
                    label="Cancel"
                    onClick={() => navigate('/patientProfile', {state: {patient: location.state.patient}})} />
            </BaseToolbar>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 5,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Stack spacing={2} >
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
                        <MenuItem value={"f"} style={{color: Colors.primary}}>
                            Female
                        </MenuItem>
                        <MenuItem value={"m"} style={{color: Colors.primary}}>
                            Male
                        </MenuItem>
                    </StyledTextField>
                    <StyledButtonPrimary type="submit">Update Patient</StyledButtonPrimary>
                </Stack>
            </Box>
        </Fragment>
    )
}