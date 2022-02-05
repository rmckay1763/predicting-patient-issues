import { Fragment, useEffect, useState } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import PatientTableToolbar from './PatientTableToolbar';
import PatientTableExpandedRow from './PatientTableExpandedRow';
import { Colors } from "../resources/Colors"
import { Icons } from '../resources/Icons';
import { useGlobal } from '../contexts/GlobalContext';
 
/**
 * Creates the data table component.
 * @returns DataTable component with list of patients
 */
export default function PatientTable() {
    
    const [state, ] = useGlobal();
    const [data, setData] = useState([]);
    const [criticalOnly, setCriticalOnly] = useState(false);
    const [query, setQuery] = useState('');

    // prepare patient data for rendering
    useEffect(() => {
        function mapStatus(patient) {
            switch (patient.status) {
                case 0:
                    patient.status = 'Critical';
                    break;
                case 9:
                    patient.status = 'Stable';
                    break;
                default:
                    break;
            }
        }
        let temp = state.patients;
        temp.sort((a, b) => a.status - b.status);
        temp = temp.filter((patient) => {
            return (
                patient.lastname.toLowerCase().includes(query.toLowerCase()) ||
                patient.firstname.toLowerCase().includes(query.toLowerCase()) ||
                patient.pid.toString().includes(query.toLowerCase())
            );
        });
        if (criticalOnly) {
            temp = temp.filter((patient) => {
                return patient.status === 'Critical';
            });
        }
        temp.map(mapStatus);
        setData(temp);
    }, [state.patients, query, criticalOnly]);

    // click handler for table rows
    const onRowClicked = (row) => {
        let selected = state.patients.find((patient) => patient.pid === row.pid);
        console.log(selected);
    }

    // conditional styling for critical status
    const conditionalCellStyles = [
        {
            when: row => row.status === 'Critical',
            style: {
                backgroundColor: Colors.alert,
                color: Colors.white
            }
        }
    ]

    // theme for table
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

    // component for expanded rows
    const expandedComponent = ({data}) => {
        let rows = state.vitals
        rows = rows.filter((vital) => {
            return vital.pid === data.pid;
        });
        return <PatientTableExpandedRow data={rows} />
    }
        
    // table columns
    const columns = [
        {
            id: 'pid',
            name: 'Patient ID',
            selector: row => row.pid,
            sortable: true,
            maxWidth: "10%"
        },
        {
            button: true,
            cell: () => Icons.info
        },
        {
            id: 'lastname',
            name: 'Last Name',
            selector: row => row.lastname,
            sortable: true
        },
        {
            id: 'firstname',
            name: 'First Name',
            selector: row => row.firstname,
            sortable: true
        },
        {
            id: 'status',
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            conditionalCellStyles: conditionalCellStyles
        },
    ];

    return (
        <Fragment>
            <PatientTableToolbar setCriticalOnly={setCriticalOnly} setQuery={setQuery} />
            <DataTable
                theme = 'theme'
                keyField = 'pid'
                sortIcon = {Icons.arrowDownward}
                striped = {true}
                highlightOnHover = {true}
                pointerOnHover = {true}
                onRowClicked = {onRowClicked}
                pagination = {true}
                expandableRows = {true}
                expandableRowsComponent = {expandedComponent}
                columns = {columns}
                data = {data}
            />
        </Fragment>
    );
}
