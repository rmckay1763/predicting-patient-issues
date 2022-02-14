import { Fragment, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import ProfileTable from "./ProfileTable";

export default function PatientProfile() {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const [patient, setPatient] = useState(location.state.patient);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        document.title = ("PPCD - " + patient.firstname + " " + patient.lastname);
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
            return navigate("/")
        } catch (error) {
            console.error(error);
            AlertError(dispatch, "Failed to delete patient");
        }
    }

    const profTitle = "Patient Profile: " + patient.firstname + " " + patient.lastname;
    const content= "Are you sure you want to remove the patient " + patient.firstname + " " + patient.lastname + " and their associated vitals records? This action cannot be undone.";

    return (
        <Fragment>
            <BaseToolbar title={profTitle}>
            <FormControlLabel 
                control={<IconButton 
                    children={Icons.delete} 
                    style={{color: Colors.primary}} />} 
                label="Delete Patient"
                onClick={() => setOpenDialog(true)} />
            </BaseToolbar>
            <ProfileTable />
            <h4>Vitals Table Toolbar w/ Add Button Goes Here.</h4>
            <h4>Vitals Table Goes Here.</h4>
            <ConfirmDialog
                open={openDialog}
                setOpen={setOpenDialog}
                onConfirm={handleDelete}
                title="Confirmation Required"
                content={content}
            />
        </Fragment>
    )
}