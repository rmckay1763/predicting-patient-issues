import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import { Colors } from "../resources/Colors";

/**
 * 
 * @props {function} setOpen - callback to set the open flag from the calling component.
 * @props {function} onConfirm - callback to execute if confirm button selected.
 * @returns Confirmation dialog with cancel and confirm buttons.
 */
export default function ConfirmDialog(props) {

    return (
        <Dialog 
            open={props.open} 
            onClose={() => props.setOpen(false)}
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: Colors.backgroundLighter,
                    color: Colors.primary
                },
                '& .MuiDialogContent-root': {
                    color: Colors.primary
                },
                '& .MuiButton-contained': {
                    color: Colors.backgroundLighter,
                    backgroundColor: Colors.primary,
                    '&:hover': {
                        color: Colors.primary,
                        backgroundColor: Colors.secondary,
                    }
                }
            }}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                {props.content}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => props.setOpen(false)}
                >
                    Cancel
                </Button
                >
                <Button
                    variant="contained"
                    onClick={() => {
                        props.setOpen(false);
                        props.onConfirm();
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}