import * as React from 'react';
import { useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { useLocation } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ProfileTable() {
    const [state, ] = useGlobal();
    const location = useLocation();
    const [patient, setPatient] = useState(location.state.patient);

    function gender () {
        if (patient.gender === 'm') {
            return "Male";
        }
        return "Female";
    } 

    return (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                <TableCell style={{ width: "10%" }}>Patient ID</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Status</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
                key={patient.pid}
                sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
            >
                <TableCell style={{ width: "10%" }}>{patient.pid}</TableCell>
                <TableCell>{gender()}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.status}</TableCell>
            </TableRow>
        </TableBody>
        </Table>
    </TableContainer>
    );
}