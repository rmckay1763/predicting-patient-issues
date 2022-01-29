/**
 * Parent Component for home page.
 */
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { GetAllPatients, GetAllVitals } from "../controllers/APIController";
import SplitPane, { SplitPaneLeft, SplitPaneRightPatientsTable } from "../components/SplitPane";
 
/**
* Generate the component for the home page.
* @returns home page component
*/
export default function HomePatients() {
    const { useToken, } = useAuth();
    const [token, ] = useToken;
    const [patients, setPatients] = useState([]);
    const [vitals, setVitals] = useState([])

    const MINUTE_MS = 10000;

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await GetAllPatients(token);
                setPatients(response.data);
            } catch (error) {
                console.error(error);
            }
            try {
                const response = await GetAllVitals(token);
                setVitals(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadData()
        const interval = setInterval(() => {
            loadData();
        }, MINUTE_MS);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
   }, [token])

   /**
    * Utility function to get patients with critical status.
    * @returns List of critical patients
    */
  //  const getCritical = () => {
  //     let critical = [];
  //     for (let row in patients) {
  //         if (patients[row].status === "critical") {
  //             let entry = {
  //                 lastname: patients[row].lastname,
  //                 firstname: patients[row].firstname,
  //                 status: patients[row].status
  //             };
  //             critical.push(entry);
  //         }
  //     }
  //     return critical;
  //  }; 
   
    return (
        <div>                  
            <SplitPane className="split-pane-row">
                <SplitPaneLeft/>
                <SplitPaneRightPatientsTable patients={patients} vitals={vitals}/>
            </SplitPane>
        </div>
    );
 } 