import { Fragment, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UpdatePatient, DeletePatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import BaseToolbar, {ToolbarLabeledIcon } from "./BaseToolbar";
import ConfirmDialog from "./ConfirmDialog";
import { AlertError, AlertSuccess } from "./AlertMessage";
import { Icons } from "../resources/Icons";

export default function PatientProfile() {
    const navigate = useNavigate();
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

    const onEnterVitals = () => {
        return navigate("/enterVitals", {state: {patient: patient}});
    }

    const onDelete = async() => {
        try {
            await DeletePatient(state.token, patient.pid);
            AlertSuccess(dispatch, "Patient deleted");
            return navigate("/")
        } catch (error) {
            console.error(error);
            AlertError(dispatch, "Failed to delete patient");
        }
    }

    return (
        <Fragment>
            <BaseToolbar title="Patient Profile">
            <ToolbarLabeledIcon 
                    icon={Icons.add} 
                    label="Enter Vitals" 
                    onClick={onEnterVitals} />
                <ToolbarLabeledIcon 
                    icon={Icons.delete} 
                    label="Delete Patient" 
                    onClick={() => setOpenDialog(true)} />
            </BaseToolbar>
            <h4>{patient.firstname} {patient.lastname}</h4>
            <ConfirmDialog
                open={openDialog}
                setOpen={setOpenDialog}
                onConfirm={onDelete}
                title="Confirmation Required"
                content="Remove patient and associated vital records?"
            />
        </Fragment>
    )
}