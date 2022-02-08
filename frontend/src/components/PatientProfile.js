import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import BaseToolbar from "./BaseToolbar";

export default function PatientProfile() {
    const location = useLocation();
    return (
        <Fragment>
            <BaseToolbar title="Patient Profile" />
            <h4>{location.state.patient.firstname}</h4>
        </Fragment>
    )
}