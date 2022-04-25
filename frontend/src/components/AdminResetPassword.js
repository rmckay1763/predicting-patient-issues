import { Fragment, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGlobal } from "../contexts/GlobalContext";
import { Box, Stack } from '@mui/material';
import { 
    StyledTextField, 
    StyledButtonPrimary, 
    StyledButtonSecondary, 
    StyledTypography, 
  } from '../resources/StyledComponents';
import { AlertError, AlertSuccess} from './AlertMessage';
import { ChangePassword } from '../controllers/APIController';
import BaseToolbar from './BaseToolbar';

import { Icons } from '../resources/Icons';
import { Colors } from '../resources/Colors';

export default function AdminResetPassword () {

    const navigate = useNavigate();
    const [state, dispatch] = useGlobal();
    const location = useLocation();
    const user = location.state.user;
    const token = state.token;
    const title = "Reset User Password: " + user.username;

    const [newPassword, setNewPassword] = useState();
    const [confirmedPassword, setConfirmedPassword] = useState();

    useEffect(() => {
        document.title = ("PPCD - Reset User Password");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updated = {
            uid: user.uid,
            password: newPassword
        }
        if (newPassword !== confirmedPassword) {
            AlertError(dispatch, "Passwords do not match!");
            return;
        }
        try {
            // update with new password
            let response = await ChangePassword(token, updated);
            console.log(response.data);
            if (response.data) {
                AlertSuccess(dispatch, "Password has been changed!");
                return navigate('/editUser', {state: {uid: user.uid}});
            } else {
              throw Error("Failed to update password");
            }
        } catch (error) {
            AlertError(dispatch, "Failed to update password");
            console.log(error.message);
        }
    };

    return (
        <Fragment>
            
            <BaseToolbar title={title}>
                <StyledButtonSecondary
                    startIcon={Icons.close}
                    onClick={() => navigate('/editUser', {state: {uid: user.uid}})} 
                    >
                    Cancel
                </StyledButtonSecondary>
            </BaseToolbar>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 5,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Stack spacing={2} padding={2} >
                    <StyledTypography variant="subtitle1" textAlign="center">
                        This will reset the password of {user.username}. Proceed with caution.
                    </StyledTypography>
                    <StyledTextField
                        required
                        autoFocus
                        label="New Password"
                        display="block"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} />
                    <StyledTextField
                        required
                        label="Confirm New Password"
                        display="block"
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)} />
                    <StyledButtonPrimary type="submit">Reset Password</StyledButtonPrimary>
                </Stack>
            </Box>
        </Fragment>
    )
}