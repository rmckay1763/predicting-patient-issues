import { 
    Children,  
    isValidElement,
    useEffect, 
    useState, 
    forwardRef
} from 'react';
import { 
    Switch,  
    FormControlLabel, 
    InputAdornment,
    IconButton,
    TextField,
    Toolbar, 
    Typography,
    Box,
} from '@mui/material';
import { Colors } from '../resources/Colors';
import { Icons } from '../resources/Icons';

/**
 * Base toolbar component for application pages.
 * Any component that renders as the parent in the right/left pane should include this toolbar. 
 * 
 * @param {*} props Expects a props.title. Child components are optional. 
 * @returns Toolbar with passed in title and optional child components.
 */
const BaseToolbar = (props, ref) => {

    const [children, setChildren] = useState(null);
    
    useEffect(() => {
        let temp = Children.map(props.children, (child) => {
            if (isValidElement(child)) {
                return (
                    <Box children={child} />
                )
            }
            return child;
        });
        setChildren(temp);
    }, [props.children])

    return (
        <Toolbar 
            ref={ref}
            sx={{ 
                backgroundColor: Colors.secondary, 
                color: Colors.primary, 
                '& .MuiBox-root': {
                    flexGrow: 1
                },
                '& .MuiTypography-h6': {
                    flexGrow: 10
                },
            }}
        >
            <Typography variant="h6" children={props.title} />
            {children}
        </Toolbar>
    )
}
export default forwardRef(BaseToolbar);

/**
 * @props {Icon} icon -- The icon to display
 * @props {function} onClick -- Callback for click events
 * @returns IconButton for base toolbar
 */
export const ToolbarIcon = (props) => (
    <IconButton
        children={props.icon}
        onClick={props.onClick}
        sx={{
            color: Colors.primary,
            '&:hover': {
                backgroundColor: Colors.primary,
                color: Colors.secondary,
            }
        }}
    />
);

/**
 * @props {function} onChange -- Callback for switch events
 * @returns Switch for base toolbar component
 */
export const ToolbarSwitch = (props) => (
    <Switch 
        onChange = {props.onChange} 
        sx={{
            '& .MuiSwitch-switchBase': {
                color: Colors.focus,
            },
            '& .Mui-checked': {
                color: Colors.primary,
            },
            '& .Mui-checked + .MuiSwitch-track': {
                backgroundColor: Colors.primary,
            },
            '& .MuiSwitch-track': {
                backgroundColor: Colors.primary,
            },
        }}
    />
);

/**
 * @props {Icon} icon -- The icon for the action button
 * @props {string} label -- The label for the action button
 * @props {function} onClick -- Callback for click events
 * @returns FormControlLabel icon action button for base menu
 */
export const ToolbarLabeledIcon = (props) => (
    <FormControlLabel 
        control={<IconButton children={props.icon} />}
        label={props.label}
        onClick={props.onClick} 
        sx={{
            '& .MuiIconButton-root': {
                color: Colors.primary,
            },
            '&:hover .MuiFormControlLabel-label': {
                fontWeight: 600
            },
        }} 
    />
);

/**
 * @props {string} label -- The label for the switch
 * @props {function} onClick -- Callback for click events
 * @returns FormControlLabel switch for base toolbar component
 */
export const ToolbarLabeledSwitch = (props) => (
    <FormControlLabel 
        control={<ToolbarSwitch />}
        label={props.label}
        onClick={props.onClick} 
        sx={{
            '&:hover .MuiFormControlLabel-label': {
                fontWeight: 600
            },
        }} 
    />
);

/**
 * @props {function} onChange -- Callback for input change 
 * @returns TextField search box for base toolbar component
 */
export const ToolbarSearch = (props) => (
    <TextField 
        variant="standard"
        placeholder="Search"
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    {Icons.search}
                </InputAdornment>
            )
        }}
        onChange={props.onChange}
        sx={{
            '& .MuiInput-underline': {
                color: Colors.primary,
            },
            '&& .MuiInput-underline:before': {
                borderColor: Colors.primary
            },
            '&& .MuiInput-underline:after': {
                borderColor: Colors.primary
            },
            '&& .MuiInput-underline:hover::before': {
                borderColor: Colors.primary
            },
            '& .MuiInputAdornment-root': {
                color: Colors.primary,
            },
        }}
    />
);