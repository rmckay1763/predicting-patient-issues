/**
 * Custom navigation component. 
 * Uses ContextProvider and reducer style actions to navigate to routes.
 * 
 * To add a route to the navigator:
 *  - add a key/value to the 'Destinations' object
 *  - add a case to the switch in the 'restoreLocation' function
 *  - add a case to the switch in the 'navigateReducer' function
 */

import { useReducer, useContext, createContext } from "react";
import EditProfileForm from "../components/EditProfileForm";
import PatientTable from "../components/PatientTable";

/**
 * Possible destinations for the navigator
 */
export const Destinations = {
    patientTable: 'patient_table',
    editProfile: 'edit_profile'
};

/**
 * Context for the navigator
 */
const NavigatorContext = createContext({
    location: null,
    navigator: () => null
});

/**
 * Restores the location on browser reload
 * @returns Previous destination retrieved from local storage
 */
const restoreLocation = () => {
    let lastLocation = localStorage.getItem("lastLocation");
    lastLocation = lastLocation ? lastLocation : Destinations.patientTable;
    switch (lastLocation) {
        case Destinations.patientTable:
            return <PatientTable />;
        case Destinations.editProfile:
            return <EditProfileForm />;
        default:
            throw new Error(`Unknown location: ${lastLocation}`);
    }
}

/**
 * Hook to access the navigator
 * @returns The location and the navigator [location, navigator]
 */
export const useNavigator = () => useContext(NavigatorContext);

/**
 * ContextProvider for the navigator
 * @param {*} props Components to use the navigator
 * @returns Child components with access to the navigator
 */
export const NavigatorProvider = (props) => {
    const [location, navigator] = useReducer(navigateReducer, restoreLocation());
    return (
        <NavigatorContext.Provider value = {[ location, navigator ]}>
            {props.children}
        </NavigatorContext.Provider>
    )
};

/**
 * Reducer function to update the destination. Called automatically.
 * @param {*} location Current location
 * @param {*} destination Location to navigate to
 * @returns The new destination
 */
const navigateReducer = (location, destination) => {
    switch (destination) {
        case Destinations.patientTable:
            localStorage.setItem("lastLocation", Destinations.patientTable);
            return <PatientTable />;
        case Destinations.editProfile:
            localStorage.setItem("lastLocation", Destinations.editProfile);
            return <EditProfileForm />;
        default:
            throw new Error(`Unknown destination: ${destination}`);
    };
};