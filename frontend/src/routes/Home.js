import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GetAllPatients } from "../controllers/APIController";

import {Colors} from "../config/colors";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Home() {
  const { useToken, useUser } = useAuth();
  const [token, setToken] = useToken;
  const [user, setUser] = useUser;
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    return navigate("/login");
  };


  const getPatients = async () => {
    try {
      const response = await GetAllPatients(token);
      setPatients(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // for testing
  const showUser = () => {
    console.log(user);
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={logout}>Logout</button>
      <button onClick={getPatients}>Get Patients</button>
      <button onClick={showUser}>Show User</button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{bgcolor: Colors.primary,}}>
              <TableCell sx={{color: '#fff'}}>First name</TableCell>
              <TableCell sx={{color: '#fff'}}>Last name</TableCell>
              <TableCell sx={{color: '#fff'}}>Age</TableCell>
              <TableCell sx={{color: '#fff'}}>Gender</TableCell>
              <TableCell sx={{color: '#fff'}}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.pid} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {patient.firstname}
                </TableCell>
                <TableCell>{patient.lastname}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
