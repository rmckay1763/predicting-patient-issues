import DataTable, {createTheme} from 'react-data-table-component';
import { Colors } from '../resources/Colors';

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
            title='Detailed Vitals Information'
            theme = 'theme'
            defaultSortFieldId='time'
            defaultSortAsc={false}
            striped={true}
            columns={columns}
            data={data}
        />
    );

}