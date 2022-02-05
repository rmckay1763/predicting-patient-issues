import { useRef } from 'react';
import { 
    Switch,  
    FormControlLabel, 
    Input, 
    InputAdornment,
    IconButton,
} from '@mui/material'
import BaseToolbar from './BaseToolbar';
import { useComponentWidth } from "../contexts/Dimensions";
import { Colors } from "../resources/Colors"
import { Icons } from '../resources/Icons';

/**
 * Toolbar for the patient table.
 * @param {*} param0 Event handlers for toolbar actions.
 * @returns A toolbar for the patient table.
 */
export default function PatientTableToolbar({ setCriticalOnly, setQuery }) {

    const toolbar = useRef(null)
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

    }

    // Reduced toolbar for small screen sized
    if (width < breakpoint) return (
        <BaseToolbar title="Patients" ref={toolbar}>
            <IconButton 
                children={Icons.add}
                style={{color: Colors.primary}}
                onChange={onAddPatient}
            />
            <Switch 
                onChange = {onCriticalOnlyChanged} 
                style={{color: Colors.primary}}/>
            <Input 
                id="filter"
                placeholder="Search"
                startAdornment={
                    <InputAdornment position="start" style={{color: Colors.primary}} >
                        {Icons.search}
                    </InputAdornment>
                }
                onChange={onSearchChanged}
            />
        </BaseToolbar> 
    )

    // Toolbar for standard screen size
    return (
        <BaseToolbar title="Patients" ref={toolbar}>
            <FormControlLabel 
                control={<IconButton 
                    children={Icons.add} 
                    style={{color: Colors.primary}} />} 
                label="Add Patient"
                labelPlacement="right"
                onChange={onAddPatient} />
            <FormControlLabel 
                control={<Switch  
                    style={{color: Colors.primary}} />} 
                label="Critical Only"
                labelPlacement="right"
                onChange = {onCriticalOnlyChanged} />
            <Input 
                id="filter"
                placeholder="Search"
                startAdornment={
                    <InputAdornment position="start" style={{color: Colors.primary}} >
                        {Icons.search}
                    </InputAdornment>
                }
                onChange={onSearchChanged}
            />
        </BaseToolbar>
    )
}