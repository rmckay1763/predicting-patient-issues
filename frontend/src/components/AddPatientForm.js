import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import { AddPatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import BaseToolbar from "./BaseToolbar";
import BaseForm from "./BaseForm";
import { AlertSuccess, AlertError } from "./AlertMessage";
import { Colors } from "../resources/Colors";

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
        document.title = "PPCD - Add Patient";
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
        let response = await AddPatient(state.token, patient);
        if (response.data) {
            AlertSuccess(dispatch, "Patient successfully added!");
            return navigate("/");
        } else {
            AlertError(dispatch, "Failed to add patient!");
            clearInput();
        }
    }

    return (
        <Fragment>
            <BaseToolbar title="Add New Patient"></BaseToolbar>
            <BaseForm 
                title="Patient Information"
                onSubmit={handleSubmit}
                submitLabel="Add Patient"
            >
                <TextField
                    id="outlined-basic"
                    required
                    autoFocus
                    label="First name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)} />
                <TextField
                    id="outlined-basic"
                    required
                    label="Last name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)} />
                <TextField
                    id="outlined-basic"
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
                <TextField
                    id="outlined-basic"
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
                </TextField>
            </BaseForm>
        </Fragment>
    )
}