import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    Switch,  
    FormControlLabel, 
    Input, 
    InputAdornment,
    IconButton,
    TextField
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
            <IconButton 
                children={Icons.add}
                style={{color: Colors.primary}}
                onChange={onAddPatient}
            />
            <Switch 
                onChange = {onCriticalOnlyChanged} 
                sx={{
                    color: Colors.primary,
                    '& .Mui-checked': {
                        color: Colors.alert,
                        backgroundColor: Colors.alert
                    }
                }}
            />
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
        <BaseToolbar title="Patients" ref={toolbar} >
            <FormControlLabel 
                control={<IconButton 
                    children={Icons.add} 
                    //sx={{color: Colors.primary}} 
                />} 
                label="Add Patient"
                onClick={onAddPatient} 
                sx={{
                    '& .MuiIconButton-root': {
                        color: Colors.primary,
                    },
                    '&:hover .MuiFormControlLabel-label': {
                        fontWeight: 600
                    },
                }} />
            <FormControlLabel
                control={<Switch />} 
                label="Critical Only"
                onChange = {onCriticalOnlyChanged}
                sx={{
                    color: Colors.primary,
                    backgroundColor: Colors.secondary,
                    '& .MuiSwitch-switchBase': {
                        color: Colors.primary,
                    },
                    '& .Mui-checked': {
                        color: Colors.alert,
                        '& + .MuiSwitch-track': {
                            backgroundColor: Colors.primary,
                            },
                    },
                    '& .MuiSwitch-track': {
                        backgroundColor: Colors.primary,
                    },
                    '&:hover .MuiFormControlLabel-label': {
                        fontWeight: 600
                    },
                }} 
            />
            <TextField 
                variant="standard"
                placeholder="Search"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {Icons.search}
                        </InputAdornment>
                    )
                }}
                onChange={onSearchChanged}
                sx={{
                    '& .MuiInput-underline': {
                        color: Colors.primary,
                    },
                    '&& .MuiInput-underline:before': {
                        borderColor: Colors.primary
                    },
                    '&& .MuiInput-underline:after': {
                        borderColor: Colors.primary
                    },
                    '&& .MuiInput-underline:hover::before': {
                        borderColor: Colors.primary
                    },
                    '& .MuiInputAdornment-root': {
                        color: Colors.primary,
                    },
                }}
            />
        </BaseToolbar>
    )
}