import { createContext, useReducer, useContext } from "react";

export const Actions = {
    setToken: 'set_token',
    clearToken: 'clear_token',
    setUser: 'set_user',
    clearUser: 'clear_user',
    setPatients: 'set_patients',
    setVitals: 'set_vitals'
};

const GlobalContext = createContext({
    state: null,
    dispatch: () => null
});

export const useGlobal = () => useContext(GlobalContext)

export const GlobalProvider = (props) => {
    const initialState = {
        token: props.token,
        user: props.user,
        patients: null,
        vitals: null
    };
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <GlobalContext.Provider value = {[ state, dispatch ]}>
            {props.children}
        </GlobalContext.Provider>
    )
};

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