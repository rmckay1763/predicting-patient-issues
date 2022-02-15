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
            theme = 'theme'
            customStyles={customStyles}
            defaultSortFieldId='time'
            defaultSortAsc={false}
            striped={true}
            columns={columns}
            data={data}
        />
    );
}