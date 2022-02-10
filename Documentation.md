## Documentation for Frontend

 #### Global State

 The global state uses the following React hooks:
- [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)
- [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)
 
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

#### Adding Routes

The `BaseRoute` component provides a convenient wrapper element to render components in the right pane of the application. Follow these steps to add a route to the application.
- Create a React component with the desired functionality. For example:
    ```
    /frontend/components/NewComponent.js
    ```
- Import the new component into `/frontend/routes/Routes.js`
    ```
    import NewComponent from ../components/NewComponent.js
    ```
- Create a function in `/frontend/routes/Routes.js` to return the new component wrapped with `BaseRoute`.
    ```
    export const NewComponentRoute = () => {
        return (
            <AuthRoute>
                <BaseRoute>
                    <NewComponent />
                </BaseRoute>
            </AuthRoute>
        );
    }
    ```
- Create a new `Route` in `/frontend/App.js` and add the wrapped component as the `element`
    ```
    <Route
        exact
        path="/newComponent"
        element={
            <NewComponentRoute />
        }
    />
    ```

#### Toolbar for Components
To maintain consistency, each component that renders as the right pane should include a `BaseToolbar` element. First add the import:

    import BaseToolbar from './BaseToolbar';

`BaseToolbar` expects a title to to passed as a prop

    <BaseToolbar title="Some Title" />

To add elements such a as buttons, icons, etc, list them as children. The elements will display in left-to-right order, beginning with the first child

    <BaseToolbar title="Some Title">
        <Input />
        <Button />
    </BaseToolbar>

will produce a toolbar titled "Some Title" with a `Input` element and a `Button` element