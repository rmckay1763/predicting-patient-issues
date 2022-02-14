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
    return (
        <Box
            component="form"
            onSubmit={props.onSubmit}
            method="post"
            mt={5}
            display="flex"
            justifyContent="center"
            sx={{
                '& .MuiTypography-root': {
                    color: Colors.primary,
                    textAlign: "center",
                },
                '& .MuiOutlinedInput-root': {
                    color: Colors.primary, 
                    input: {color: Colors.primary},
                    '&.Mui-focused fieldset': {
                        borderColor: Colors.primary
                    },
                    '&:hover fieldset': {
                        borderColor: Colors.primary,
                    },
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
            }}
            
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