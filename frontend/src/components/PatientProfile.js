import { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    FormControlLabel,
    IconButton
} from "@mui/material";
import { UpdatePatient, DeletePatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import BaseToolbar from "./BaseToolbar";
import ConfirmDialog from "./ConfirmDialog";
import { AlertError, AlertSuccess } from "./AlertMessage";
import { Colors } from "../resources/Colors";
import { Icons } from "../resources/Icons";

export default function PatientProfile() {
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const [patient, setPatient] = useState(location.state.patient);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        document.title = "PPCD - Patient Profile";
    }, []);

    const handleUpdate = async () => {
        try {
            return await UpdatePatient(state.token, patient);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async() => {
        try {
            await DeletePatient(state.token, patient.pid);
            AlertSuccess(dispatch, "Patient deleted");
        } catch (error) {
            console.error(error);
            AlertError(dispatch, "Failed to delete patient");
        }
    }

    return (
        <Fragment>
            <BaseToolbar title="Patient Profile">
            <FormControlLabel 
                control={<IconButton 
                    children={Icons.delete} 
                    style={{color: Colors.primary}} />} 
                label="Delete Patient"
                onClick={() => setOpenDialog(true)} />
            </BaseToolbar>
            <h4>{patient.firstname} {patient.lastname}</h4>
            <ConfirmDialog
                open={openDialog}
                setOpen={setOpenDialog}
                onConfirm={handleDelete}
                title="Confirmation Required"
                content="Remove patient and associate vital records?"
            />
        </Fragment>
    )
}