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
    }, [state.token, props.data.pid]);

    useEffect(() => loadData(), [loadData]);

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
            dense={true}
            striped={true}
            columns={columns}
            data={data}
        />
    );

}