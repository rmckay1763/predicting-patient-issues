import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { InputAdornment, IconButton } from '@mui/material'
import BaseToolbar from './BaseToolbar';
import { 
    StyledTextField, 
    StyledIconButton, 
    StyledSwitch, 
    StyledFormControlLabel, 
 } from '../resources/StyledComponents'
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

    /**
     * @returns Search box component for toolbar.
     */
    const SearchBox = () => (
        <StyledTextField 
            variant="standard"
            onChange={onSearchChanged}
            placeholder="Search"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {Icons.search}
                    </InputAdornment>
                )
            }} />
    );

    /**
     * @returns Reduced toolbar for small screen size.
     */
    const reduced = () => (
        <BaseToolbar title="Patients" ref={toolbar}>
            <StyledIconButton onClick={onAddPatient} >
                {Icons.add}
            </StyledIconButton>
            <StyledSwitch onChange={onCriticalOnlyChanged} />
            {SearchBox()}
        </BaseToolbar>
    );

    /**
     * @returns Full toolbar for regular size screen.
     */
    const full = () => (
        <BaseToolbar title="Patients" ref={toolbar} >
            <StyledFormControlLabel 
                control={<IconButton children={Icons.add} />}
                label={"Add Patient"}
                onClick={onAddPatient} />
            <StyledFormControlLabel 
                control={<StyledSwitch />}
                label={"Critical Only"}
                onClick={onCriticalOnlyChanged} />
            {SearchBox()}
        </BaseToolbar>
    );

    return width < breakpoint ? reduced() : full();
}

