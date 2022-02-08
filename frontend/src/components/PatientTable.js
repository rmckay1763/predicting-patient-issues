import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DataTable, { createTheme } from 'react-data-table-component';
import PatientTableToolbar from './PatientTableToolbar';
import PatientTableExpandedRow from './PatientTableExpandedRow';
import { Colors } from "../resources/Colors"
import { Icons } from '../resources/Icons';
import { useGlobal } from '../contexts/GlobalContext';
import { IconButton } from '@mui/material';
 
/**
 * Creates the data table component.
 * @returns DataTable component with list of patients
 */
export default function PatientTable() {
    
    const [state, ] = useGlobal();
    const [data, setData] = useState([]);
    const [criticalOnly, setCriticalOnly] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    document.title = "PPCD - Patients";

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
        return navigate('/patientProfile', {state: {patient: selected}})
    }

    // component for expanded rows
    const expandedComponent = ({data}) => {
        let rows = state.vitals
        rows = rows.filter((vital) => {
            return vital.pid === data.pid;
        });
        return <PatientTableExpandedRow data={rows} />
    }

    // action button for patient profile
    const profileButton = (row) => {
        return (
            <IconButton 
                onClick={() => onRowClicked(row)} 
                sx={{
                    color: Colors.primary, 
                    '&:hover': { color: Colors.secondary, background: Colors.primary}
                }}
            >
                {Icons.patientProfile}
            </IconButton>
        )
    }

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

    // custom style for expander button
    const customStyles = {
        expanderButton: {
            style: {
                '&:hover:enabled': {
                    cursor: 'pointer',
                    color: Colors.secondary,
                    backgroundColor: Colors.primary
                },
                '&:hover:not(:disabled)': {
                    cursor: 'pointer',
                    backgroundColor: Colors.primary,
                },
                '&:focus': {
                    outline: 'none',
                    backgroundColor: Colors.backgroundLight,
                },
            },
        },
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
            cell: (row) => profileButton(row)
            
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
                pagination = {true}
                expandableRows = {true}
                expandableRowsComponent = {expandedComponent}
                columns = {columns}
                data = {data}
                customStyles={customStyles}
            />
        </Fragment>
    );
}
