/**
 * Data table for list of patients.
 */

import { useEffect, useState } from 'react';
import { 
    Switch, 
    FormGroup, 
    FormControlLabel, 
    Input, 
    InputAdornment 
} from '@mui/material'
import DataTable, { createTheme } from 'react-data-table-component';
import { Colors } from "../resources/Colors"
import { Icons } from '../resources/Icons';
import { useGlobal } from '../contexts/GlobalContext';
 
/**
 * Creates the data table component.
 * @param {*} props The list of patients and list of vitals
 * @returns DataTable component with list of patients
 */
export default function PatientTable() {
    
    const [state, ] = useGlobal();
    const [data, setData] = useState([]);
    const [criticalOnly, setCriticalOnly] = useState(false);
    const [query, setQuery] = useState('');

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

    /**
     * Handler for critical only toggle button.
     * @param {*} event From the critical only switch
     */
    const onToggleChanged = (event) => {
        setCriticalOnly(event.target.checked);
    }

    /**
     * Handler for search box events.
     * @param {*} event From the search box
     */
    const onSearchChanged = (event) => {
        setQuery(event.target.value);
    }

    // header component with search box and critical only toggle
    const searchComponent = (
        <div>
            <FormGroup>
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
            <FormControlLabel 
                control={<Switch 
                    onChange = {onToggleChanged} 
                    style={{color: Colors.primary}}/>} 
                label="Critical Only" />
            </FormGroup>
        </div>
    )
    
    // subtable component for expanded rows
    const expandedComponent = ({data}) => {
        let rows = state.vitals
        rows = rows.filter((vital) => {
            return vital.pid === data.pid;
        });
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
                defaultSortFieldId='time'
                defaultSortAsc={false}
                dense={true}
                striped={true}
                columns={columns}
                data={rows}
            />
        );
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
        
    // columns for main table
    const columns = [

        {
            id: 'pid',
            name: 'Patient ID',
            selector: row => row.pid,
            sortable: true
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

    // theme for main table
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

    const title = (
        <h3>Patient Information</h3>
    )

    return (
        <DataTable
            theme = 'theme'
            title = {title}
            keyField = 'pid'
            sortIcon = {Icons.arrowDownward}
            striped = {true}
            highlightOnHover = {true}
            pagination = {true}
            expandableRows = {true}
            expandableRowsComponent = {expandedComponent}
            actions = {searchComponent}
            columns = {columns}
            data = {data}
        />
    );
}
