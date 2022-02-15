import { Fragment, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Stack, 
    Typography, 
    Box, 
    Divider,
} from "@mui/material"
import { UpdatePatient, DeletePatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import PatientProfileToolbar from "./PatientProfileToolbar";
import ProfileTable from "./ProfileTable";
import ConfirmDialog from "./ConfirmDialog";
import { AlertError, AlertSuccess } from "./AlertMessage";
import { Colors } from "../resources/Colors";

export default function PatientProfile() {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const [patient, setPatient] = useState(location.state.patient);
    const [deletePatient, setDeletePatient] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");

    useEffect(() => {
        document.title = ("PPCD - " + patient.firstname + " " + patient.lastname);
        let message = "Are you sure you want to remove the patient " + 
            patient.firstname + " " + patient.lastname + 
            " and their associated vitals records? This action cannot be undone.";
        setDeleteMessage(message);
    }, [patient]);

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
            <PatientProfileToolbar patient={patient} onDelete={setDeletePatient} />
            {/* <ProfileTable />
            <h4>Vitals Table Toolbar w/ Add Button Goes Here.</h4>
            <h4>Vitals Table Goes Here.</h4> */}

            <Stack 
                direction="row" 
                spacing={5}
                sx={{
                    backgroundColor: Colors.backgroundLight,
                    justifyContent: "center"
                }}
            >
                <HeaderItem label="Patient ID" value={patient.pid} />
                <HeaderItem label="Age" value={patient.age} />
                <HeaderItem label="Gender" value={patient.gender} />
                <HeaderItem label="Status" value={patient.status} />
            </Stack>
            <ConfirmDialog
                open={deletePatient}
                setOpen={setDeletePatient}
                onConfirm={onDelete}
                title="Confirmation Required"
                content={deleteMessage}
            />
        </Fragment>
    )
}

const HeaderItem = (props) => {
    const [color, setColor] = useState(Colors.primary);
    const [value, setValue] = useState("");

    useEffect(() => {
        switch(props.value) {
            case "Critical":
                setColor(Colors.alert);
                setValue(props.value);
                break;
            case "f":
                setValue("Female");
                break;
            case "m":
                setValue("Male");
                break;
            default:
                setValue(props.value);
                break;
        }
    }, [props.value])
    

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                padding: 2,
            }}
        >
        <Typography
            variant="subtitle1"
            sx={{
                color: color,
                fontWeight: 600,
            }}
        >
            {props.label}: 
        </Typography>
        <Typography
            variant="subtitle1"
            sx={{
                color: color,
                ml: 2
            }}
        >
            {value}
        </Typography>
        </Box>
    )
}