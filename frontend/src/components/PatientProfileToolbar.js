import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    StyledButtonSecondary,
    StyledIconButton, 
 } from '../resources/StyledComponents';
import BaseToolbar from './BaseToolbar';
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

    const onUpdate = () => {
        return navigate("/editPatient", {state: {patient: props.patient}});
    }

    const onDelete = () => {
        props.onDelete(true);
    }

    /**
     * @returns Reduced toolbar for small screen size.
     */
    const reduced = () => (
        <BaseToolbar title={title} ref={toolbar}>
            <StyledIconButton onClick={onEnterVitals} >
                {Icons.add}
            </StyledIconButton>
            <StyledIconButton onClick={onUpdate} >
                {Icons.edit}
            </StyledIconButton>
            <StyledIconButton onClick={onDelete} >
                {Icons.delete}
            </StyledIconButton>
        </BaseToolbar> 
    )

    /**
     * @returns Full toolbar for regular screen size.
     */
    const full = () => (
        <BaseToolbar title={title} ref={toolbar}>
            <StyledButtonSecondary 
                startIcon={Icons.add}
                onClick={onEnterVitals}
            >
                Enter Vitals
            </StyledButtonSecondary>
            <StyledButtonSecondary 
                startIcon={Icons.edit}
                onClick={onUpdate}
            >
                Edit Patient
            </StyledButtonSecondary>
            <StyledButtonSecondary 
                startIcon={Icons.delete}
                onClick={onDelete}
            >
                Delete Patient
            </StyledButtonSecondary>
        </BaseToolbar> 
    )

    return width < breakpoint ? reduced() : full()
}