/**
 * Parent Component for home page.
 */
 import { useEffect } from "react";
 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "../contexts/AuthContext";
 import { GetAllPatients, GetAllVitals } from "../controllers/APIController";
 import SplitPane from "../components/SplitPane";
 import { SplitPaneLeft } from "../components/SplitPane";
 import { SplitPaneRightPatientsTable } from "../components/SplitPane";
 
 /**
  * Generate the component for the home page.
  * @returns home page component
  */
 export default function HomePatients() {
   const { useToken, useUser } = useAuth();
   const [token, setToken] = useToken;
   const [user, setUser] = useUser;
   const navigate = useNavigate();
   const [patients, setPatients] = useState([]);
   const [vitals, setVitals] = useState([])

   const MINUTE_MS = 10000;

   useEffect(() => {
     loadData();

     const interval = setInterval(() => {
       loadData();
     }, MINUTE_MS);

     return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
   }, [])
 
   /**
    * Sets the state variable for the list of patients.
    */
   const getPatients = async () => {
     try {
       const response = await GetAllPatients(token);
       setPatients(response.data);
     } catch (error) {
       console.error(error);
     }
   };
 
   /**
    * Sets the state variable for list of vitals.
    */
   const getVitals = async () => {
     try {
       const response = await GetAllVitals(token);
       setVitals(response.data);
     } catch (error) {
       console.log(error);
     }
   }
 
   /**
    * Make api calls to load required data
    */
   const loadData = async () => {
     await getPatients();
     await getVitals();
   }

   /**
    * Utility function to get patients with critical status.
    * @returns List of critical patients
    */
   const getCritical = () => {
     let critical = [];
     for (let row in patients) {
       if (patients[row].status === "critical") {
         let entry = {
           lastname: patients[row].lastname,
           firstname: patients[row].firstname,
           status: patients[row].status
         };
         critical.push(entry);
       }
     }
     return critical;
   }; 
   
   return (
     <div>                  
       <SplitPane className="split-pane-row">
        <SplitPaneLeft/>
        <SplitPaneRightPatientsTable patients={patients} vitals={vitals}/>
      </SplitPane>
     </div>
   );
 } 