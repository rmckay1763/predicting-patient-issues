import { Fragment, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UpdatePatient, DeletePatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import BaseToolbar, {ToolbarLabeledIcon } from "./BaseToolbar";
import ConfirmDialog from "./ConfirmDialog";
import { AlertError, AlertSuccess } from "./AlertMessage";
import { Icons } from "../resources/Icons";
import ProfileTable from "./ProfileTable";
import VitalsTable from "./VitalsTable";

export default function PatientProfile() {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const [patient, setPatient] = useState(location.state.patient);
    const [openDialog, setOpenDialog] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        document.title = ("PPCD - " + patient.firstname + " " + patient.lastname);

        let rows = state.vitals
        rows = rows.filter((vital) => {
            return vital.pid === patient.pid;
        });
        setData(rows);
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

    const profTitle = "Patient Profile: " + patient.firstname + " " + patient.lastname;
    const content= "Are you sure you want to remove the patient " + patient.firstname + " " + patient.lastname + " and their associated vitals records? This action cannot be undone.";

    return (
        <Fragment>
            <BaseToolbar title={profTitle}>
            <ToolbarLabeledIcon 
                    icon={Icons.add} 
                    label="Enter Vitals" 
                    onClick={onEnterVitals} />
                <ToolbarLabeledIcon 
                    icon={Icons.delete} 
                    label="Delete Patient" 
                    onClick={() => setOpenDialog(true)} />
            </BaseToolbar>
            <ProfileTable />
            <VitalsTable data={data}/>
            <ConfirmDialog
                open={openDialog}
                setOpen={setOpenDialog}
                onConfirm={onDelete}
                title="Confirmation Required"
                content={content}
            />
        </Fragment>
    )
}