import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import BaseToolbar, {
    ToolbarIcon,
    ToolbarLabeledIcon,
    ToolbarSwitch,
    ToolbarLabeledSwitch,
    ToolbarSearch
} from './BaseToolbar';
import { useComponentWidth } from "../contexts/Dimensions";
import { Icons } from '../resources/Icons';

/**
 * Toolbar for the patient table.
 * @param {*} param0 Event handlers for toolbar actions.
 * @returns A toolbar for the patient table.
 */
export default function PatientTableToolbar({ setCriticalOnly, setQuery }) {

    const navigate = useNavigate();
    const toolbar = useRef(null);
    const { width } = useComponentWidth(toolbar);
    const breakpoint = 700; 

    /**
     * Handler for critical only toggle button.
     * @param {*} event From the critical only switch
     */
     const onCriticalOnlyChanged = (event) => {
        setCriticalOnly(event.target.checked);
    }

    /**
     * Handler for search box events.
     * @param {*} event From the search box
     */
    const onSearchChanged = (event) => {
        setQuery(event.target.value);
    }

    /**
     * Handler for add patient button.
     */
    const onAddPatient = () => {
        return navigate("/newPatient");
    }

    // Reduced toolbar for small screen sized
    if (width < breakpoint) return (
        <BaseToolbar title="Patients" ref={toolbar}>
            <ToolbarIcon 
                onClick={onAddPatient} 
                icon={Icons.add} />
            <ToolbarSwitch onChange={onCriticalOnlyChanged} />
            <ToolbarSearch onChange={onSearchChanged} />
        </BaseToolbar> 
    )

    // Toolbar for standard screen size
    return (
        <BaseToolbar title="Patients" ref={toolbar} >
            <ToolbarLabeledIcon 
                icon={Icons.add}
                onClick={onAddPatient} 
                label="Add Patient" />
            <ToolbarLabeledSwitch 
                onClick={onCriticalOnlyChanged}
                label="Critical Only"
            />
            <ToolbarSearch onChange={onSearchChanged} />
        </BaseToolbar>
    )
}

