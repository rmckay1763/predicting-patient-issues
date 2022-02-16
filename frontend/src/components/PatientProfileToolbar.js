import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import BaseToolbar, { ToolbarIcon, ToolbarLabeledIcon } from './BaseToolbar';
import { useComponentWidth } from "../contexts/Dimensions";
import { Icons } from '../resources/Icons';

/**
 * @props {object} patient -- The selected patient
 * @props {function} onDelete -- Callback for delete action
 * @returns Component for patient table toolbar
 */
export default function PatientProfileToolbar(props) {
    const navigate = useNavigate();
    const toolbar = useRef(null);
    const { width } = useComponentWidth(toolbar);
    const breakpoint = 700; 
    const title = "Patient Profile: " + props.patient.firstname + " " + props.patient.lastname;

    const onEnterVitals = () => {
        return navigate("/enterVitals", {state: {patient: props.patient}});
    }

    const onDelete = () => {
        props.onDelete(true);
    }

    // Reduced toolbar for small screen sized
    if (width < breakpoint) return (
        <BaseToolbar title={title} ref={toolbar}>
            <ToolbarIcon 
                onClick={onEnterVitals} 
                icon={Icons.add} />
            <ToolbarIcon 
                onClick={onDelete} 
                icon={Icons.delete} />
        </BaseToolbar> 
    )

    // Toolbar for standard screen size
    return (
        <BaseToolbar title={title} ref={toolbar}>
            <ToolbarLabeledIcon 
                onClick={onEnterVitals} 
                icon={Icons.add}
                label="Enter Vitals" />
            <ToolbarLabeledIcon 
                onClick={onDelete} 
                icon={Icons.delete}
                label="Delete Patient" />
        </BaseToolbar> 
    )
}