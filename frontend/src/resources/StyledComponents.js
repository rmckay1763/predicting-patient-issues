import {
    Button,
    TextField,
    Typography,
    IconButton,
    Switch, 
    FormControlLabel, 
    Menu, 
    List,
} from "@mui/material";
import { Colors } from "../resources/Colors";
import { styled } from "@mui/system"

/**
 * Typography with primary colored text.
 */
export const StyledTypography = styled(Typography)({
    color: Colors.primary,
});

/**
 * IconButton with primary colored icon and hover effect.
 */
export const StyledIconButton = styled(IconButton)({
    color: Colors.primary,
    '&:hover': {
        backgroundColor: Colors.primary,
        color: Colors.secondary,
    }
});

/**
 * FormControlLabel with primary color applied. 
 */
export const StyledFormControlLabel = styled(FormControlLabel)({
    color: Colors.primary,
    '& .MuiCheckbox-root': {
        color: Colors.primary,
    },
    '& .Mui-checked': {
        color: Colors.primary,
    },
})

/**
 * Switch with primary color applied.
 */
export const StyledSwitch = styled(Switch)({
    '&.CustomSwitch': {
        '& .MuiSwitch-switchBase': {
            color: Colors.focus,
        },
        '& .MuiSwitch-track': {
            backgroundColor: Colors.primary,
        },
        '& .Mui-checked': {
            color: Colors.primary,
        },
        '& .Mui-checked + .MuiSwitch-track': {
            backgroundColor: Colors.primary,
        },
    }
})

/**
 * Applies primary color theme to TextField elements of various types. 
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
 * Button filled with primary color and secondary color on hover.
 */
export const StyledButtonPrimary = styled(Button)({
    color: Colors.backgroundLighter,
    backgroundColor: Colors.primary,
    '&:hover': {
        color: Colors.primary,
        backgroundColor: Colors.secondary,
    }
});

/**
 * Button filled with secondary color and primary color on hover.
 */
export const StyledButtonSecondary = styled(Button)({
    color: Colors.primary,
    backgroundColor: Colors.secondary,
    '&:hover': {
        color: Colors.backgroundLighter,
        backgroundColor: Colors.primary,
    }
});

/**
 * Applies primary color theme to Menu and child MenuItems.
 */
export const StyledMenu = styled(Menu)({
    '& .MuiPaper-root': {
        backgroundColor: Colors.backgroundLighter,
        color: Colors.primary
    },
    '& .MuiListItemIcon-root': {
        color: Colors.primary,
    },
    '& .MuiMenuItem-root': {
        '&:hover': {
            backgroundColor: Colors.secondary
        }
    },
    '& .NotClickable:hover': {
        backgroundColor: Colors.backgroundLighter,
        cursor: 'auto'
    }
});

/**
 * Applies primary color theme to List and child ListItem elements.
 */
export const StyledList = styled(List)({
    '& .MuiListItem-root': {
        '&:hover': {
            backgroundColor: Colors.secondary,
        }
    },
    '& .MuiListItemIcon-root': {
        color: Colors.primary,
    },
    '& .MuiListItemText-root': {
        color: Colors.primary,
    }
})
