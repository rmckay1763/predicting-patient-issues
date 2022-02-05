import { forwardRef } from 'react';
import { 
    Children,  
    isValidElement,
    useEffect, 
    useState, 
} from 'react'
import { Toolbar, Typography, Box } from '@mui/material'
import { Colors } from "../resources/Colors"

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
                    <Box 
                        style={{
                            backgroundColor: Colors.secondary,
                            color: Colors.primary,
                            flexGrow: 1}}
                    >
                        {child}
                    </Box>
                )
            }
            return child;
        });
        setChildren(temp);
    }, [props.children])

    return (
        <Toolbar 
            ref={ref}
            style={{ backgroundColor: Colors.secondary, color: Colors.primary }}
        >
            <Typography variant="h6" style={{ flexGrow: 10 }}>
                {props.title}
            </Typography>
            {children}
        </Toolbar>
    )
}

export default forwardRef(BaseToolbar);