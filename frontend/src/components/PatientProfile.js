import { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UpdatePatient, DeletePatient } from "../controllers/APIController";
import { useGlobal } from "../contexts/GlobalContext";
import BaseToolbar from "./BaseToolbar";

export default function PatientProfile() {
    const [state, ] = useGlobal();
    const location = useLocation();
    const [patient, setPatient] = useState(location.state.patient);

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
            return await DeletePatient(patient.pid);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Fragment>
            <BaseToolbar title="Patient Profile" />
            <h4>{patient.firstname} {patient.lastname}</h4>
        </Fragment>
    )
}