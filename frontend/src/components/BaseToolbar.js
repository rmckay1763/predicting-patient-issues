import { 
    Children,  
    isValidElement,
    useEffect, 
    useState, 
    forwardRef
} from 'react';
import {  
    Box,
    Toolbar,
} from '@mui/material';
import { StyledTypography } from '../resources/StyledComponents';
import { Colors } from '../resources/Colors';

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
            <StyledTypography variant="h6" >{props.title}</StyledTypography>
            {children}
        </Toolbar>
    )
}
export default forwardRef(BaseToolbar);