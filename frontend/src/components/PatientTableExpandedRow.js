import DataTable from 'react-data-table-component';

export default function PatientTableExpandedRow({ data }) {

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