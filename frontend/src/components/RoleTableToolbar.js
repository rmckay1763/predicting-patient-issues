import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { InputAdornment } from '@mui/material'
import BaseToolbar from './BaseToolbar';
import { 
    StyledTextField, 
    StyledIconButton,
    StyledButtonSecondary, 
 } from '../resources/StyledComponents'
import { useComponentWidth } from "../contexts/Dimensions";
import { Icons } from '../resources/Icons';

/**
 * Toolbar for the role table.
 * @param {*} param0 Event handlers for toolbar actions.
 * @returns A toolbar for the role table.
 */
export default function RoleTableToolbar({ setQuery, addRole }) {

    const navigate = useNavigate();
    const toolbar = useRef(null);
    const { width } = useComponentWidth(toolbar);
    const breakpoint = 700;

    /**
     * Handler for search box events.
     * @param {*} event From the search box
     */
    const onSearchChanged = (event) => {
        setQuery(event.target.value.toLowerCase());
    }

    /**
     * Handler for add role button.
     */
    const onAddRole = () => {
        addRole();
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
        <BaseToolbar title="Role" ref={toolbar}>
            <StyledIconButton onClick={onAddRole} >
                {Icons.add}
            </StyledIconButton>
            {SearchBox()}
        </BaseToolbar>
    );

    /**
     * @returns Full toolbar for regular size screen.
     */
    const full = () => (
        <BaseToolbar title="Roles" ref={toolbar} >
            <StyledButtonSecondary 
                startIcon={Icons.add}
                onClick={onAddRole} 
            >
                Add Role
            </StyledButtonSecondary>
            {SearchBox()}
        </BaseToolbar>
    );

    return width < breakpoint ? reduced() : full();
}