import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem, Box, Stack } from "@mui/material";
import { AddPatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import { useComponentWidth } from "../contexts/Dimensions";
import BaseToolbar from "./BaseToolbar";
import { 
    StyledButtonPrimary,
    StyledButtonSecondary,
    StyledIconButton,
    StyledTextField,
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
    const [state, dispatch] = useGlobal();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [ageError, setAgeError] = useState(false);

    useEffect(() => {
        document.title = "PPCD - Patient Profile";
    });

    const clearInput = () => {
        setFirstname("");
        setLastname("");
        setAge("");
        setGender("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let patient = {
            firstname: firstname,
            lastname: lastname,
            gender: gender,
            age: age
        }
        try {
            let response = await AddPatient(state.token, patient);
            if (!response.data) {
                throw new Error("Empty reponse");
            }
            AlertSuccess(dispatch, "Patient successfully added!");
            return navigate("/");
        } catch (error) {
            AlertError(dispatch, "Failed to add patient");
            clearInput();
        }
    }

    const AddPatientToolbar = () => {
        const ref = useRef(null);
        const { width } = useComponentWidth(ref);
        const breakpoint = 600;

        const full = () => (
            <BaseToolbar title="Add New Patient" ref={ref}>
                <StyledButtonSecondary
                        startIcon={Icons.close}
                        onClick={() => navigate("/")} 
                >
                    Cancel
                </StyledButtonSecondary>
            </BaseToolbar>
        )

        const reduced = () => (
            <BaseToolbar title="Enter Vitals" ref={ref} >
                <StyledIconButton onClick={() => navigate("/")}>
                    {Icons.close}
                </StyledIconButton>
            </BaseToolbar>
        )

        return width < breakpoint ? reduced() : full()
    }

    return (
        <Fragment>
            <AddPatientToolbar />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 5,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Stack spacing={2} padding={2}>
                    <StyledTypography variant="subtitle1" textAlign="center">
                        Patient Information
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
                    <StyledButtonPrimary type="submit">Add Patient</StyledButtonPrimary>
                </Stack>
            </Box>
        </Fragment>
    )
}