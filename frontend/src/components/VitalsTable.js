import DataTable, {createTheme} from 'react-data-table-component';
import { Colors } from '../resources/Colors';

/**
 * 
 * @props {list} data -- The vitals data to populate the table
 * @returns Component for table of vitals
 */
export default function VitalsTable({ data }) {

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
            striped: {
                default: Colors.backgroundLighter,
                text: Colors.primary
            },
        }
    )

    const customStyles = {
        headRow: {
            style: {
                color: Colors.backgroundLighter,
                backgroundColor: Colors.primary,
                fontWeight: 600,
            },
        },
    }

    const columns = [
        {
            name: 'Heart Rate',
            selector: row => row.heart_rate,
            right: true
        },
        {
            name: 'SaO2',
            selector: row => row.sao2,
            right: true
        },
        {
            name: 'Respiration',
            selector: row => row.respiration,
            right: true
        },
        {
            name: 'Systolic',
            selector: row => row.systolic,
            right: true
        },
        {
            name: 'Diastolic',
            selector: row => row.diastolic,
            right: true
        },
    ];

    return (
        <DataTable
            theme = 'theme'
            customStyles={customStyles}
            striped={true}
            columns={columns}
            data={data}
        />
    );
}