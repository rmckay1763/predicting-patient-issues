import { useState, useEffect, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import { useGlobal } from '../contexts/GlobalContext';
import { GetVitals } from '../controllers/APIController';

/**
 * 
 * @props {object} data -- Selected row from the patient table.
 * @returns Table component for patient vitals.
 */
export default function PatientTableExpandedRow(props) {
    const [state, ] = useGlobal();
    const [data, setData] = useState([]);

    const loadData = useCallback(async () => {
        let response = await GetVitals(state.token, props.data.pid);
        setData(response.data);
    }, [state.token, props]);

    useEffect(loadData);

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
            data={data}
        />
    );

}