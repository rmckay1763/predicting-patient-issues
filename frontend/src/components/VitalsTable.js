import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material'
import DataTable, {createTheme} from 'react-data-table-component';
import { Colors } from '../resources/Colors';

export default function VitalsTable({ data, patient }) {

    const SubHeader = (
        <Stack 
            divider={<Divider orientation="vertical" flexItem />}
            direction="row" 
            spacing={5}
            sx={{
                backgroundColor: Colors.backgroundLight,
                //justifyContent: "center"
            }}
        >
            <HeaderItem label="Patient ID" value={patient.pid} />
            <HeaderItem label="Age" value={patient.age} />
            <HeaderItem label="Gender" value={patient.gender} />
            <HeaderItem label="Status" value={patient.status} />
        </Stack>
    )

    createTheme(
        'theme',
        {
            text: {
                primary: Colors.primary,
                secondary: Colors.primary,
            },
            background: {
                default: Colors.backgroundLight
            },
            divider: {
                default: Colors.focus,
            },
            button: {
                default: Colors.primary,
                hover: Colors.secondary,
                focus: Colors.focus,
            },
            striped: {
                default: Colors.backgroundLighter,
                text: Colors.primary
            },
            highlightOnHover: {
                default: Colors.focus,
                text: Colors.primary
            },
        }
    )

    const columns = [
        {
            id: 'time',
            name: 'Time',
            selector: row => row.timestamp,
        },
        {
            name: 'Heart Rate',
            selector: row => row.heart_rate,
        },
        {
            name: 'SaO2',
            selector: row => row.sao2,
        },
        {
            name: 'Respiration',
            selector: row => row.respiration,
        },
    ];

    return (
        <DataTable
            //title='Detailed Vitals Information'
            title={SubHeader}
            theme = 'theme'
            defaultSortFieldId='time'
            defaultSortAsc={false}
            //subHeader={true}
            striped={true}
            //subHeaderComponent={SubHeader}
            columns={columns}
            data={data}
        />
    );

}



const HeaderItem = (props) => {
    const [color, setColor] = useState(Colors.primary);
    const [value, setValue] = useState("");

    useEffect(() => {
        switch(props.value) {
            case "Critical":
                setColor(Colors.alert);
                setValue(props.value);
                break;
            case "f":
                setValue("Female");
                break;
            case "m":
                setValue("Male");
                break;
            default:
                setValue(props.value);
                break;
        }
    }, [props.value])
    

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                //padding: 2,
                '& .MuiTypography-root': {
                    //fontSize: 18,
                }
            }}
        >
        <Typography
            variant="h6"
            sx={{
                color: color,
                fontWeight: 600,
                
            }}
        >
            {props.label}: 
        </Typography>
        <Typography
            variant="h6"
            sx={{
                color: color,
                ml: 2
            }}
        >
            {value}
        </Typography>
        </Box>
    )
}