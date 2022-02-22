import {
    Box,
    Typography,
    Button,
    Stack,
    TextField
} from "@mui/material";
import { styled } from "@mui/system"
import { Colors } from "../resources/Colors";

/**
 * @props {function} onSubmit -- Callback for submit button
 * @props {string} title -- Title at top of form
 * @props {string} submitLabel -- Label for submit button
 * @returns Component to add a patient.
 */
export const BaseForm = (props) => (
    <Box
        component="form"
        onSubmit={props.onSubmit}
        sx={{
            mt: 5,
            display: "flex",
            justifyContent: "center",
        }}
    >
        <Stack spacing={2} >
            <Typography variant="subtitle1" color={Colors.primary} textAlign="center">
                {props.title}
            </Typography>
            {props.children}
            <StyledButton type="submit" variant="contained">
                {props.submitLabel}
            </StyledButton>
        </Stack>
    </Box>
)

/**
 * @returns TextField component with theme applied.
 */
export const StyledTextField = styled(TextField)({
    '& .MuiInput-root': {
        color: Colors.primary
    },
    '& .MuiInput-underline': {
        color: Colors.primary,
    },
    '& .MuiInput-underline:before': {
        borderColor: Colors.primary
    },
    '& .MuiInput-underline:after': {
        borderColor: Colors.primary
    },
    '&& .MuiInput-underline:hover::before': {
        borderColor: Colors.primary
    },
    '& .MuiInputAdornment-root': {
        color: Colors.primary,
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
    '& .MuiInputLabel-root': {
        color: Colors.primary + '90',
        },
    '& .MuiInputLabel-outlined': {
        color: Colors.primary + '90',
        },
    '& label.Mui-focused': {
        color: Colors.primary,
    },
})

/**
 * @returns Button with theme applied
 */
export const StyledButton = styled(Button)({
    color: Colors.backgroundLighter,
        backgroundColor: Colors.primary,
        '&:hover': {
            color: Colors.primary,
            backgroundColor: Colors.secondary,
        }
})