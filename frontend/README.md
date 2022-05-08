# Frontend Container

**IMPORTANT! Please read the top level README first**

### **Contents**

- [Synopsis](#synopsis)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Development](#development)
- [Deployment](#deployment)

---

### **Synopsis**

A [React](https://reactjs.org/docs/getting-started.html) web application that follows [Material UI](https://mui.com/material-ui/getting-started/installation/) design. The application provides an interface for users to monitor a list of patients. All users can manage patients, while users with admin status have additional privilegs including managing other users. The frontend makes frequent API calls to the backend to keep application data fresh.

[back to contents](#contents)

---

### **Architecture**

The application separates concerns to promote modularity and also provides several layers for rendering components.

- **Config**  
`api.js` configures an [axios](https://axios-http.com/docs/intro) instance to make HTTP requests to the backend container.
- **Controllers**  
The functions in `APIController.js` use the axios instance to make async calls to interact with the HTTP routes available in the backend container. Note that all functions return a `response` object, forcing the caller to use async calls. 
- **Global State**  
The application maintains a global state, `GlobalContext.js`, to provide a single source of truth for data shared between components. See this [article](https://www.thisdot.co/blog/creating-a-global-state-with-react-hooks) for a guide.
- **Styled Components**  
The application strictly uses [MUI](https://mui.com/material-ui/getting-started) components to provide a consistent user experience. `StyledComponents.js` provides convience functions for commonly used base components with the application theme applied. These components comprise the building blocks for larger components.
- **Components**  
At the least, each page of the application has a `[ComponentName].js` file to render the page. More complex pages may have sub components of the page extracted into separate files, e.g. most pages have a separate file for the toolbar that renders at the top of the component. These files should use components from `StyledComponents.js` whenever possible to promote consistency, e.g. use `StyledTextField` instead of `TextField`.
- **Routes**  
Each page of the application has a function to return the page as a component. These functional components, in `Routes.js`, are called by the top level `App.js` file to handle navigation. All routes should be wrapped with at least one of the following:
    - `BaseRoute` makes API calls to load data and updates the global state. The route returns a split pane view with a list of notifications on the left and the child component as the right pane. `BaseRoute` should wrap all other routes except for the login page.
    - `GenericRoute` allows the user to access a page without a bearer authentication token. Only the login route should use this.
    - `AuthRoute` requires a valid bearer token and defaults to the login page if the token fails authentication. All routes intended for regular users should be wrapped with this route.
    - `AdminAuthRoute` requires a valid bearer token associated with an user with admin status. All routes for admin only features should be wrapped with this route.

[back to contents](#contents)

---

### **File Structure**

`/frontend`
- `package.json` - dependencies file
- `Dockerfile` - default build file
- `Dockerfile.prod` - production build file
- `.env` - environment variables
- `/public` - react auto generated directory
- `/nginx` - directory
    - `server.conf` - configuration file for server (only used in production)
- `/src` - directory for application source files.
    - `App.js` - top level component
    - `/components` - directory for application components
    - `/config` - directory for configuration functions
    - `/contexts` - directory for application contexts
    - `/controllers` - directory for controller functions
    - `/resources` - directory for application resources


[back to contents](#contents)

---

### **Development**

The default build file `Dockerfile` will build a [Node.js](https://hub.docker.com/_/node) based image and start the React application in development mode. The docker-compose setup uses a volume so that any changes on the local machine update the code inside the running docker container. The development mode for React uses hot reloading, so simply modify the code locally and watch the changes get applied inside the container! The application runs on `localhost:5000`.

[back to contents](#contents)

---

### **Deployment**

The production build file `Dockerfile.prod` will produce an optimized production build. The docker file uses a multi-stage build to add a [nginx](https://hub.docker.com/_/nginx) server in front of the application. Unlike development mode, where the containers communicated directly, all requests initially go the frontend and the server then fowards requests as needed to other containers. The server listens for the following locations:
- `/api` - url's matching this path get fowarded to the `FastAPI` running on the backend container
- `/predict` - url's matching this path get fowarded to the `FastAPI` running on the ml-server container
- `/` - all other url's get sent to the React app.  

The application runs on `localhost`

*Note - The URL for the backend api in the `.env` file needs to be updated before building the frontend. Specifying `localhost` as the URL resulted in CORS errors when deploying the application to a TTU server. To resolve, specifiy the explicit address that will host the application, e.g. `htttp://wwww.somedomain.com`. Also note that the production build runs on port 80 instead of 8000.

[back to contents](#contents)