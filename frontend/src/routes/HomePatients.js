/**
 * Parent Component for home page.
 */

import { useViewport } from "../contexts/UseViewport";
import { useEffect } from "react";
import { useGlobal, Actions } from "../contexts/GlobalContext";
import { GetAllPatients, GetAllVitals } from "../controllers/APIController";

import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
} from 'react-reflex'

import { BrowserView, MobileView } from 'react-device-detect';

import 'react-reflex/styles.css'

import PatientTable from "../components/PatientTable";
import NotificationPanel from "../components/NotificationPanel";
/**
* Generate the component for the home page.
* @returns home page component
*/
export default function HomePatients() {
    const [state, dispatch] = useGlobal();
    const MINUTE_MS = 10000;

    document.title = "PPCD - Patients";  

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await GetAllPatients(state.token);
                dispatch({ type: Actions.setPatients, payload: response.data });
            } catch (error) {
                console.error(error);
            }
            try {
                const response = await GetAllVitals(state.token);
                dispatch({ type: Actions.setVitals, payload: response.data });
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

    const { width } = useViewport();
    const breakpoint = 900;

    if (width < breakpoint) {
        document.body.style.overflow = 'scroll';

        return (
            <PatientTable />
        )
    }
    else
    {
        document.body.style.overflow = 'hidden';
    }

    return (
        <div>
            <BrowserView>
                <ReflexContainer orientation="vertical">
                    <ReflexElement className="left-pane" maxSize="400">
                        <div className="pane-content">
                            <NotificationPanel />
                        </div>
                    </ReflexElement>
                    <ReflexSplitter style={{ height: "1080px" }}>
                    </ReflexSplitter>
                    <ReflexElement className="right-pane">
                        <div className="pane-content">
                            <PatientTable />
                        </div>
                    </ReflexElement>
                </ReflexContainer>
            </BrowserView>
            <MobileView>
                <PatientTable />
            </MobileView>
        </div>
    );
} 