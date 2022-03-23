import { useCallback, useEffect, Fragment } from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import 'react-reflex/styles.css'
import { BrowserView, MobileView } from 'react-device-detect';
import { useGlobal, Actions } from "../contexts/GlobalContext";
import { GetAllPatients, GetUsers } from "../controllers/APIController";
import { useViewport } from "../contexts/Dimensions";
import Navbar from "../components/NavBar";
import NotificationPanel from "../components/NotificationPanel";
import AlertMessage from "../components/AlertMessage";

/**
 * Base route for destinations. 
 * Child component will render as the right pane of the application.
 * @returns Split pane layout with appbar.
 */
export default function BaseRoute(props) {

    const [state, dispatch] = useGlobal();
    const MINUTE_MS = 10000;
    const { width } = useViewport();
    const breakpoint = 900;

    // api calls
    const loadPatientData = useCallback(async () => {
        try {
            const response = await GetAllPatients(state.token);
            dispatch({ type: Actions.setPatients, payload: response.data });
        } catch (error) {
            console.error(error);
        }
    }, [dispatch, state.token]);

    const loadAdminData = useCallback(async () => {
        if (!state.user.admin) {
            dispatch({ type: Actions.clearUsers });
            return;
        }
        try {
            const response = await GetUsers(state.token);
            dispatch({ type: Actions.setUsers, payload: response.data });
        } catch (error) {
            console.log(error);
        }
    }, [dispatch, state.token, state.user.admin]);

    // data updates
    useEffect(() => {
        loadPatientData();
        const interval = setInterval(() => {
            loadPatientData();
        }, MINUTE_MS);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [loadPatientData])

    useEffect(() => {
        loadAdminData();
        const interval = setInterval(() => {
            loadAdminData();
        }, MINUTE_MS);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [loadAdminData])

    // return single pane if narrow screen size
    if (width < breakpoint) {
        return (
            <Fragment>
                <AlertMessage />
                <Navbar />
                {props.children}
            </Fragment>
        );
    }

    // return split pane for normal screen size
    return (
        <Fragment>
            <AlertMessage />
            <Navbar />
            <BrowserView>
                <ReflexContainer orientation="vertical" windowResizeAware={true}>
                    <ReflexElement flex="1">
                        <NotificationPanel />
                    </ReflexElement>
                    <ReflexSplitter style={{ height: "1080px" }} />
                    <ReflexElement flex="3">
                        {props.children}
                    </ReflexElement>
                </ReflexContainer>
            </BrowserView>
            <MobileView>
                {props.children}
            </MobileView>
        </Fragment>
    );
}
