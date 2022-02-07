## Documentation for Frontend

### Custom Hooks

The following custom hooks combine useContext and useReducer hooks:
- [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)
- [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)

 #### Global State
 
To use the global state, first import the dependencies:

    import { useGlobal, Actions } from "../contexts/GlobalContext"

Then, inside a functional component, call the custom hook to get a reference to the `state` object and the `dispatch` object to perform updates:

    const [state, dispatch] = useGlobal(); 

Note that the `useGlobal()` hook returns an array with two members, the `state` object and the `dispatch` object to update the state.

**Accessing state**

Now the component can access any member of the `state` object, for example, `state.user` references the object representing the current user logged into the app. To see available members of the `state` object, or to add a member, refer to the documentation inside `frontend/contexts/GlobalContext.js`

**Updating state**

The reference to the `dispatch` object returned from the `useGlobal()` hook allows updates to the `state` object. To update the state, call `dispatch` and provide it with an Action. For example, to update `state.patients`, assuming that `response.data` is the updated list

    dispatch({ type: Actions.setPatients, payload: response.data });

The action provided to `dispatch` has the following form

    { type: someAction, payload: someData }

where `type` specifies the update to perform and `payload` provides any necessary data. The `payload` is optional and not included for all actions. To see available actions, or to add an action, refer to the documentation inside `frontend/contexts/GlobalContext.js`

#### Navigation

To use the custom navigator, first import the dependencies

    import { useNavigator, Destinations } from "../contexts/Navigator";

Then, inside a functional component, call the custom hook to get a reference to the `location` object and the `navigator` to navigate to destinations:

    const [location, navigator] = useNavigator();

The `location` object references the component currently rendered in the right pane of the app. Only `Home.js` should need a reference to this object, so other components can import just the navigator:

    const [, navigator] = useNavigator();

To render a page in the right pane, call the `navigator` object and pass in the destination. For example, to render the patient table:

    navigator(Destinations.patientTable);

To see available destinations, or to add a new destination, refer to the documentation inside `frontend/contexts/Navigator.js`

