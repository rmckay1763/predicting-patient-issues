import { 
    Switch,  
    FormControlLabel, 
    Input, 
    InputAdornment,
    Toolbar, 
    Typography, 
    Button,
    Box
} from '@mui/material'
import { Colors } from "../resources/Colors"
import { Icons } from '../resources/Icons';

export default function PatientTableToolbar({ setCriticalOnly, setQuery }) {

    /**
     * Handler for critical only toggle button.
     * @param {*} event From the critical only switch
     */
     const onCriticalOnlyChanged = (event) => {
        setCriticalOnly(event.target.checked);
    }

    /**
     * Handler for search box events.
     * @param {*} event From the search box
     */
    const onSearchChanged = (event) => {
        setQuery(event.target.value);
    }

    return (
        <Toolbar style={{ backgroundColor: Colors.secondary, color: Colors.primary }}>
            <Typography
                variant="h5"
                noWrap
                component="div"
                style={{ flexGrow: 4 }}
            >
                Patients
            </Typography>
            <Box style={{ flexGrow: 1 }}>
                <Button 
                    size="small"
                    variant="text"
                    startIcon={Icons.add}
                    style={{color: Colors.primary }}
                >
                    New Patient
                </Button>
            </Box>
            <FormControlLabel 
                style={{ flexGrow: 1}}
                control={<Switch 
                    onChange = {onCriticalOnlyChanged} 
                    style={{color: Colors.primary}}/>} 
                label="Critical Only" />
            <Input 
                style={{color: Colors.primary}}
                id="filter"
                placeholder="Search"
                startAdornment={
                    <InputAdornment position="start" style={{color: Colors.primary}} >
                        {Icons.search}
                    </InputAdornment>
                }
                onChange={onSearchChanged}
            />
        </Toolbar>
    )

}