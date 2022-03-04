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

export const StyledTypography = styled(Typography)({
    color: Colors.primary,
});

export const StyledIconButton = styled(IconButton)({
    color: Colors.primary,
    '&:hover': {
        backgroundColor: Colors.primary,
        color: Colors.secondary,
    }
});

export const StyledFormControlLabel = styled(FormControlLabel)({
    '& .MuiIconButton-root': {
        color: Colors.primary,
    },
    '&:hover .MuiFormControlLabel-label': {
        fontWeight: 600
    },
})

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

export const StyledButton = styled(Button)({
    color: Colors.backgroundLighter,
        backgroundColor: Colors.primary,
        '&:hover': {
            color: Colors.primary,
            backgroundColor: Colors.secondary,
        }
});

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
