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
 * @props {object} user - The selected user to edit. 
 * @Props {function} onDelete - Callback for the delete user button.
 * @returns Toolbar for the edit user form component.
 */
export default function EditUserFormToolbar(props) {
    const navigate = useNavigate();
    const toolbar = useRef(null);
    const { width } = useComponentWidth(toolbar);
    const breakpoint = 750; 
    const title = "Edit User: " + props.user.username;

    const resetPassword = () => {
        return navigate("/resetPassword", {state: {user: props.user}});
    }

    const onDelete = () => {
        props.onDelete(true);
    }

    const onClose = () => {
        return navigate("/users");
    }

    /**
     * @returns Reduced toolbar for small screen size.
     */
    const reduced = () => (
        <BaseToolbar title={title} ref={toolbar}>
            <StyledIconButton onClick={resetPassword} >
                {Icons.reset}
            </StyledIconButton>
            <StyledIconButton onClick={onDelete} >
                {Icons.delete}
            </StyledIconButton>
            <StyledIconButton onClick={onClose} >
                {Icons.close}
            </StyledIconButton>
        </BaseToolbar> 
    )

    /**
     * @returns Full toolbar for regular screen size.
     */
    const full = () => (
        <BaseToolbar title={title} ref={toolbar}>
            <StyledButtonSecondary 
                startIcon={Icons.reset}
                onClick={resetPassword}
            >
                Reset Password
            </StyledButtonSecondary>
            <StyledButtonSecondary 
                startIcon={Icons.delete}
                onClick={onDelete}
            >
                Delete User
            </StyledButtonSecondary>
            <StyledButtonSecondary 
                startIcon={Icons.close}
                onClick={onClose}
            >
                Close
            </StyledButtonSecondary>
        </BaseToolbar> 
    )

    return width < breakpoint ? reduced() : full()
}