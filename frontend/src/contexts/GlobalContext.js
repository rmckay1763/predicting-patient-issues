/**
 * Global state with Context Provider. 
 * To add to the global state: 
 *  - Add a data member to the initial state in the GlobalProvider function.
 *  - Add availabe actions for the data in the Actions object.
 *  - Add a case for each action in the switch inside the reducer function.
 */

import { createContext, useReducer, useContext } from "react";

/**
 * Available actions for the dispatcher
 */
export const Actions = {
    setToken: 'set_token',
    clearToken: 'clear_token',
    setUser: 'set_user',
    clearUser: 'clear_user',
    setPatients: 'set_patients',
    setVitals: 'set_vitals'
};

/**
 * Global state context
 */
const GlobalContext = createContext({
    state: null,
    dispatch: () => null
});

/**
 * Hook to access global state
 * @returns The global state and the dispacher to perform updates
 */
export const useGlobal = () => useContext(GlobalContext)

/**
 * Wrapper for global context
 * @param {*} props Initialze state with the token and current user
 * @returns Children wrapped with global context
 */
export const GlobalProvider = (props) => {
    // add elements to global state here
    const initialState = {
        token: props.token,
        user: props.user,
        patients: [],
        vitals: []
    };
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <GlobalContext.Provider value = {[ state, dispatch ]}>
            {props.children}
        </GlobalContext.Provider>
    )
};

/**
 * Reducer function called by dispatcher to update state.
 * @param {*} state The current state
 * @param {*} param1 The action to apply
 * @returns 
 */
const reducer = (state, { type, payload }) => {
    switch (type) {
        case Actions.setToken:
            return { ...state, token: payload };
        case Actions.clearToken:
            return { ...state, token: null }
        case Actions.setUser:
            return { ...state, user: payload };
        case Actions.clearUser:
            return { ...state, user: null }
        case Actions.setPatients:
            return { ...state, patients: payload };
        case Actions.setVitals:
            return { ...state, vitals: payload };
        default:
            throw new Error(`Unknown action type: ${type}`);
    }
};