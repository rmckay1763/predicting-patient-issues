import { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import { 
    StyledTextField, 
    StyledButtonPrimary 
} from "../resources/StyledComponents";
import { Colors } from "../resources/Colors";

/**
 * Confirmation dialog
 * 
 * @props {function} setOpen - callback to set the open flag from the calling component.
 * @props {function} onConfirm - callback to execute if confirm button selected.
 * @returns Confirmation dialog with cancel and confirm buttons.
 */
export const ConfirmDialog = (props) => {

    return (
        <Dialog 
            open={props.open} 
            onClose={() => props.setOpen(false)}
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: Colors.backgroundLighter,
                    color: Colors.primary
                }
            }}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent sx={{color: Colors.primary}}>
                {props.content}
            </DialogContent>
            <DialogActions>
                <StyledButtonPrimary
                    variant="contained"
                    onClick={() => props.setOpen(false)}
                >
                    Cancel
                </StyledButtonPrimary>
                <StyledButtonPrimary
                    variant="contained"
                    onClick={() => {
                        props.setOpen(false);
                        props.onConfirm();
                    }}
                >
                    Confirm
                </StyledButtonPrimary>
            </DialogActions>
        </Dialog>
    )
}

/**
 * Input dialog.
 * 
 * @props {function} setOpen - callback to set the open flag from the calling component.
 * @props {function} onSubmit - callback to execute if submit button selected.
 * @returns Input dialog with cancel and confirm buttons.
 */
export const InputDialogue = (props) => {
    const [role, setRole] = useState("");

    return (
        <Dialog
            open={props.open} 
            onClose={() => props.setOpen(false)}
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: Colors.backgroundLighter,
                    color: Colors.primary
                }
            }}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{color: Colors.primary}}>
                    {props.content}
                </DialogContentText>
                <StyledTextField
                    variant="standard"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <StyledButtonPrimary
                    variant="contained"
                    onClick={() => props.setOpen(false)}
                >
                    Cancel
                </StyledButtonPrimary>
                <StyledButtonPrimary
                    variant="contained"
                    onClick={() => {
                        props.setOpen(false);
                        props.onSubmit(role);
                    }}
                >
                    Submit
                </StyledButtonPrimary>
            </DialogActions>
        </Dialog>
    )
}