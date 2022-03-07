import { useCallback, useEffect, Fragment } from "react";
import { ReflexContainer, ReflexElement } from 'react-reflex'
import 'react-reflex/styles.css'
import { BrowserView, MobileView } from 'react-device-detect';
import { useGlobal, Actions } from "../contexts/GlobalContext";
import { GetUsers } from "../controllers/APIController";
import { useViewport } from "../contexts/Dimensions";
import Navbar from "../components/NavBar";
import AlertMessage from "../components/AlertMessage";

/**
 * Base route for administrative destinations. 
 * Child component will render as the right pane of the application.
 * @returns Split pane layout with appbar.
 */
 export default function BaseAdminRoute(props) {

    const [state, dispatch] = useGlobal();
    const MINUTE_MS = 30000;
    const { width } = useViewport();
    const breakpoint = 900;

    // api calls
    const loadData = useCallback(async () => {
        try {
            const response = await GetUsers(state.token);
            dispatch({ type: Actions.setUsers, payload: response.data });
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
        return (
            <Fragment>
                <AlertMessage />
                <Navbar refresh={loadData} />
                {props.children}
            </Fragment>
        );
    }

    // return split pane for normal screen size
    return (
        <Fragment>
            <Navbar refresh={loadData}/>
            <BrowserView>
                <ReflexContainer orientation="vertical" windowResizeAware={true}>
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