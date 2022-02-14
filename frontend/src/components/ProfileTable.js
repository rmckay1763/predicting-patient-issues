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
import { Colors } from '../resources/Colors';

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

    function isCritical () {
        if (patient.status === 'Critical') {
            return Colors.alert;
        }
        return Colors.backgroundLighter;
    }
    const statusColor = isCritical();
    return (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{bgcolor: Colors.backgroundLight}} style={{ width: "10%" }}>Patient ID</TableCell>
                <TableCell sx={{bgcolor: Colors.backgroundLight}}>Gender</TableCell>
                <TableCell sx={{bgcolor: Colors.backgroundLight}}>Age</TableCell>
                <TableCell sx={{bgcolor: Colors.backgroundLight}}>Status</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
                key={patient.pid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell sx={{bgcolor: Colors.backgroundLighter}} style={{ width: "10%" }}>{patient.pid}</TableCell>
                <TableCell sx={{bgcolor: Colors.backgroundLighter}}>{gender()}</TableCell>
                <TableCell sx={{bgcolor: Colors.backgroundLighter}}>{patient.age}</TableCell>
                <TableCell sx={{bgcolor: statusColor }}>{patient.status}</TableCell>
            </TableRow>
        </TableBody>
        </Table>
    </TableContainer>
    );
}