/**
 * Parent Component for home page.
 */
import { useEffect } from "react";
import { useGlobal, Actions } from "../contexts/GlobalContext";
import { GetAllPatients, GetAllVitals } from "../controllers/APIController";
import SplitPane, { SplitPaneLeft, SplitPaneRightPatientsTable } from "../components/SplitPane";
 
/**
* Generate the component for the home page.
* @returns home page component
*/
export default function HomePatients() {
    const [state, dispatch] = useGlobal();

    const MINUTE_MS = 10000;

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await GetAllPatients(state.token);
                dispatch({type: Actions.setPatients, payload: response.data});
            } catch (error) {
                console.error(error);
            }
            try {
                const response = await GetAllVitals(state.token);
                dispatch({type: Actions.setVitals, payload: response.data});
            } catch (error) {
                console.log(error);
            }
        }
        loadData()
        const interval = setInterval(() => {
            loadData();
        }, MINUTE_MS);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [state.token, dispatch])

   /**
    * Utility function to get patients with critical status.
    * @returns List of critical patients
    */
   const getCritical = () => {
      let critical = [];
      for (let row in state.patients) {
          if (state.patients[row].status === "critical") {
              let entry = {
                  lastname: state.patients[row].lastname,
                  firstname: state.patients[row].firstname,
                  status: state.patients[row].status
              };
              critical.push(entry);
          }
      }
      return critical;
   }; 
   
    return (
        <div>                  
            <SplitPane className="split-pane-row">
                <SplitPaneLeft patients={getCritical()}/>
                <SplitPaneRightPatientsTable />
            </SplitPane>
        </div>
    );
 } 