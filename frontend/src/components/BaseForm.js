import {
    Box,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import { Colors } from "../resources/Colors";

/**
 * @props {function} onSubmit -- Callback for submit button
 * @props {string} title -- Title at top of form
 * @props {string} submitLabel -- Label for submit button
 * @returns Component to add a patient.
 */
export default function BaseForm(props) {

    const style = {
        mt: 5,
        display: "flex",
        justifyContent: "center",
        '& .MuiTypography-root': {
            color: Colors.primary,
            textAlign: "center",
        },
        '& .MuiOutlinedInput-root': {
            align: "center",
            color: Colors.primary, 
            input: {color: Colors.primary},
            '& fieldset': {
                borderColor: Colors.primary,
                },
            '&.Mui-focused fieldset': {
                borderColor: Colors.primary
            },
            '&:hover fieldset': {
                borderColor: Colors.primary,
            },
        },
        '& .MuiInputLabel-outlined': {
            color: Colors.primary + '90',
            },
        '& label.Mui-focused': {
            color: Colors.primary,
        },
        '& .MuiButton-contained': {
            color: Colors.backgroundLighter,
            backgroundColor: Colors.primary,
            '&:hover': {
                color: Colors.primary,
                backgroundColor: Colors.secondary,
            }
        },
    }

    return (
        <Box
            component="form"
            onSubmit={props.onSubmit}
            method="post"
            sx={style}
        >
            <Stack spacing={2} >
                <Typography variant="subtitle1">
                    {props.title}
                </Typography>
                {props.children}
                <Button type="submit" variant="contained">
                    {props.submitLabel}
                </Button>
            </Stack>
        </Box>
    )
}