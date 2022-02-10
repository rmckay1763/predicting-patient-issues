import {
    Snackbar,
    Alert
} from "@mui/material";
import { useGlobal, Actions } from "../contexts/GlobalContext";
import { Colors } from "../resources/Colors";

/**
 * @returns Component to render snackbar alerts
 */
export default function AlertMessage () {
    const [state, dispatch] = useGlobal();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        dispatch({ type: Actions.clearAlert });
    };

    return (
        <Snackbar 
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={state.alert.open}
            onClose={handleClose}
            autoHideDuration={5000}
        >
            <Alert 
                severity={state.alert.severity} 
                variant="filled"
                sx={{
                    backgroundColor: Colors.primary,
                    '&.MuiAlert-filledError': {
                        backgroundColor: Colors.alert
                    },
                    '&.MuiAlert-filledWarning': {
                        backgroundColor: Colors.warning
                    },
                }}
            >
                {state.alert.message}
            </Alert>
        </Snackbar>
    )
}

/**
 * Renders a success alert
 * @param {*} dispatch Dispatcher from global state
 * @param {*} message The alert message
 */
export const AlertSuccess = (dispatch, message) => {
    dispatch({ 
        type: Actions.setAlert, 
        payload: {open: true, severity: "success", message: message } 
    });
}

/**
 * Renders a error alert
 * @param {*} dispatch Dispatcher from global state
 * @param {*} message The alert message
 */
export const AlertError = (dispatch, message) => {
    dispatch({
        type: Actions.setAlert, 
        payload: {open: true, severity: "error", message: message } 
    });
}

/**
 * Renders a info alert
 * @param {*} dispatch Dispatcher from global state
 * @param {*} message The alert message
 */
export const AlertInfo = (dispatch, message) => {
    dispatch({
        type: Actions.setAlert, 
        payload: {open: true, severity: "info", message: message } 
    });
}

/**
 * Renders a warning alert
 * @param {*} dispatch Dispatcher from global state
 * @param {*} message The alert message
 */
export const AlertWarning = (dispatch, message) => {
    dispatch({
        type: Actions.setAlert, 
        payload: {open: true, severity: "warning", message: message }
    });
}