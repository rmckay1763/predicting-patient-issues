import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Stack, 
    Typography, 
    Box, 
    Divider,
} from "@mui/material"
import { DeletePatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import PatientProfileToolbar from "./PatientProfileToolbar";
import ConfirmDialog from "./ConfirmDialog";
import { AlertError, AlertSuccess } from "./AlertMessage";
import { Colors } from "../resources/Colors";
import VitalsTable from "./VitalsTable";

export default function PatientProfile() {
    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const [patient, setPatient] = useState({});
    const [deletePatient, setDeletePatient] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [vitals, setVitals] = useState([]);

    useEffect(() => {
        setPatient(location.state.patient);
        document.title = ("PPCD - " + patient.firstname + " " + patient.lastname);
        let message = "Are you sure you want to remove the patient " + 
            patient.firstname + " " + patient.lastname + 
            " and their associated vitals records? This action cannot be undone.";
        setDeleteMessage(message);
        let rows = state.vitals
        rows = rows.filter((vital) => {
            return vital.pid === patient.pid;
        });
        setVitals(rows);
    }, [location.state.patient, state.vitals]);

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
        <Box backgroundColor={Colors.backgroundLight} >
            <PatientProfileToolbar patient={patient} onDelete={setDeletePatient} />
            <Stack 
                divider={<Divider orientation="vertical" variant="middle" flexItem />}
                direction="row" 
                spacing={5}
                mt={3}
                mb={3}
            >
                <HeaderItem label="Patient ID" value={patient.pid} />
                <HeaderItem label="Age" value={patient.age} />
                <HeaderItem label="Gender" value={patient.gender} />
                <HeaderItem label="Status" value={patient.status} />
            </Stack>
            <VitalsTable data={vitals} />
            <ConfirmDialog
                open={deletePatient}
                setOpen={setDeletePatient}
                onConfirm={onDelete}
                title="Confirmation Required"
                content={deleteMessage}
            />
        </Box>
    )
}

/**
 * @props {string} label -- Label for the item
 * @props {string} value -- Value for the item
 * @returns Header item for the patient profile page
 */
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
        <Box display="flex">
            <Typography
                variant="subtitle1"
                sx={{
                    color: color,
                    fontWeight: 600,
                    ml: 2
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