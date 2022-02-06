import { useCallback, useEffect, Fragment } from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import 'react-reflex/styles.css'
import { BrowserView, MobileView } from 'react-device-detect';
import { useGlobal, Actions } from "../contexts/GlobalContext";
import { GetAllPatients, GetAllVitals } from "../controllers/APIController";
import { useViewport } from "../contexts/Dimensions";
import Navbar from "./NavBar";
import NotificationPanel from "../components/NotificationPanel";
import { useNavigator } from "../contexts/Navigator";

/**
 * Home page for application. 
 * Makes api calls to update data. 
 * @returns Component for the home page
 */
export default function Home() {

    const [state, dispatch] = useGlobal();
    const [destination, ] = useNavigator();
    const MINUTE_MS = 10000;
    const { width } = useViewport();
    const breakpoint = 900;

    // api calls
    const loadData = useCallback(async () => {
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
    }, [dispatch, state.token])

    // data updates
    useEffect(() => {
        loadData()
        const interval = setInterval(() => {
            loadData();
        }, MINUTE_MS);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [loadData])

    // return single pane if narrow screen size
    if (width < breakpoint) {
        document.body.style.overflow = 'scroll';
        return (
            <Fragment>
                <Navbar refresh={loadData} />
                {destination}
            </Fragment>
        );
    }

    // return split pane for normal screen size
    return (
        <Fragment>
            <Navbar refresh={loadData}/>
            <BrowserView>
                <ReflexContainer orientation="vertical" windowResizeAware={true}>
                    <ReflexElement flex="1">
                        <NotificationPanel />
                    </ReflexElement>
                    <ReflexSplitter style={{ height: "1080px" }} />
                    <ReflexElement flex="3">
                        {destination}
                    </ReflexElement>
                </ReflexContainer>
            </BrowserView>
            <MobileView>
                {destination}
            </MobileView>
        </Fragment>
    );
}