# Predicting Patient Issues

Top level README for project

### **Contents**

- [Synopsis](#synopsis)
- [Overview](#overview)
- [User Interface](#user-interface)
- [Application Backend](#application-backend)
- [ML Sever](#ml-server)
- [ML Scheduler](#ml-scheduler)
- [Docker](#docker)
- [Development](#development)
- [Deployment](#deployment)

---

### **Synopsis**

The project integrates machine learning models with a web application to provide the user with an interface that monitors patients and issues alerts for predicted critical events.

[back to contents](#contents)

---

### **Overview**

The application consists of six docker containers that handle a single concern:
- `postgres` - maintains a database to store application data.
- `migration` - applies SQL scripts to the `postgres` service.
- `backend` - RESTful API endpoints to interact with the `postgres` server.
- `ml-server` - Decoupled API to access ML models.
- `ml-scheduler` - Schedules calls to predict status for each patient in database.
- `frontend` - User interface to experience the application.

The `/postgres` directory contains the source for the `migration` service. The source for all other services resides in the directory with the same name as the service. The directory for each service contains a `README` documenting specific concerns. The remainder of this `README` provides a high level documentation of the project as whole.

[back to contents](#contents)

---

### **User Interface**

The core of the UI consists of a split pane layout with the left pane rendering a list of notifications including patient name and status and the right pane displaying a table of patients. A status column in the table shows the predicted status of each patient. Table rows expand to show recent vital recordings for the selected patient. A navigation drawer in the application toolbar expands to provide the user with destinations. Navigating to a new destination renders the selected page in the right pane while the left pane always shows the list of notifications for a quick overview of patients.
- Selecting a patient (via the table or the notifications panel) navigates to a patient profile page that displays the patient's information and recent vital recordings. The patient profile page supports:
    - Entering new vital records.
    - Editing patient information.
    - Deleting patient from database.
- The add patient option in the navigation drawer allows the user to enter a new patient into the database.
- The user profile icon in the application toolbar expands to present the user with a short dropdown menu:
    - View Profile - displays the current user's information and supports changing the user's password.
    - Logout - ends the current session and returns to the login page.

Users with admin status have additional options in the navigation drawer to access privileged distinations.
- The manage users page displays a table of registered users and allows an admin to create new users. Selecting a user from the table navigates to the edit user page which supports:
    - Editing user information.
    - Granting/revoking admin status.
    - Deleting user from application.
- The manage roles page displays a table of user roles (medical roles, e.g. nurse). The page supports:
    - Adding a new role
    - Deleting an existing role

The `/frontend` directory implements the user interface with [React](https://reactjs.org/docs/getting-started.html) and JavaScript. The UI runs in a docker container defined as the `frontend` service in the `docker-compose.override.yml` and `docker-compose.prod.yml` files.

[back to contents](#contents)

---

### **Application Backend**

The backend of the application provides a RESTful API that allows the user interface to interact with the application database. The database contains tables to maintain patient data and registered users. Archive tables automatically store patients and vital records when a user deletes a patient from the database. The project uses database migrations to initialize the database and update the schema if necessary. The backend database provides a single source of truth for application data displayed in the frontend.

The API implements authentication with bearer tokens. All endpoints except for the `login` route require a valid token. When a user logs in, the API returns a token encoded with the primary key (uid) of the user. The token expires after twenty-four hours. The API provides a `validate` endpoint to check the token passed in through the HTTP request. This enables the frontend to validate the current user before navigating to a page and return the user to the login page when the token expires. The backend will return a 401 unauthorized status code if it receives a request without a valid token.  

The database table for registered users includes a Boolean column for admin status. The API provides a `validateAdmin` route to check if the current user has admin privileges. The route decodes the token passed in through the request to retrieve the uid of the current user. The route then checks the admin column of the user associate with uid to determine admin status. This enables the frontend to include privileged destinations for admin users.  

The `docker-compose.yml` file defines a `postgres` service that runs a PostgreSQL container to store application data.

The `/postgres` directory contains a migration script to initialize the schema. The `docker-compose.yml` file defines a `migration` service that runs a [dbmate](https://hub.docker.com/r/amacneil/dbmate) container at application start-up and executes any unapplied scripts in `/postgres/db/migrations`  

The `/backend` directory implements a [FastAPI](https://fastapi.tiangolo.com/) application with endpoints to interact with the `postgres` service. The API runs in a container defined as `backend` service in the `docker-compose.override.yml` and `docker-compose.prod.yml` files.

[back to contents](#contents)

---

### **ML Server**

The ML Server provides a decoupled API to access the machine learning aspect of the project. The project currently incorporates five vital signs into the application:
- heart rate
- soa2 level
- respiration rate
- systolic blood pressure
- diastolic blood pressure

The ML server contains a LSTM time series forecasting model for each vital sign. The models expect to receive a sequence of five vitals with five minute time steps. The models predict the next vital from the previous five. Thus, the forecasters predict a patient's vitals five minutes into the future. The ML server provides a `/predict` post route adhering to the HTTP protocal. The endpoint expects a JSON body with a time series of five sets of vital signs. The server calls the forecasters to get a predicted set of future vital signs and then checks if any of the future vitals exceed the specified safe range. Depending on the result, the server returns a `normal` status or a `alert` status along with the predicted future vitals. The `predict` route does not require any authentication, providing a resource to any application that follows the HTTP protocol.

The `/ml-server` directory contains the models and implements a [FastAPI](https://fastapi.tiangolo.com/) application with a `predict` route. The `docker-compose.override.yml` and `docker-compose.prod.yml` files define the `ml-server` service that runs the API in a Python based container.

[back to contents](#contents)

---

### **ML Scheduler**

The project uses a dedicated scheduling service to make recuring calls to the ML server. The scheduler serves as a bridge between the backend API and the ML API. A main task makes a call to the `backend` API endpoint to fetch a list of all patients in the database. For each patient, the task fetches the five most recent vitals for that patient from the `backend` and sends the response to the `predict` route of the ML server. The ML server returns a predicted status and the task then updates the patient's status with the new prediction. The scheduler makes recurring asynchronous calls to the main task to frequently update the status of each patient.

The scheduler requires a token to access the endpoints in the `backend` API that provide access to patient data. Thus, an environment file stores the token, initially set to null. The task sends a request to the `backend/validate` route to check the token, and if it fails, sends a request to `backend/login` to get a fresh token. The scheduler uses predefined admin credentials to login to the API.

The `/ml-scheduler` directory implements the scheduler in Python using the [schedule](https://schedule.readthedocs.io/en/stable/) and [requests](https://docs.python-requests.org/en/latest/) modules. The scheduler runs in a container defined as the `ml-scheduler` service in the `docker-compose.override.yml` and `docker-compose.prod.yml` files

[back to contents](#contents)

---

### **Docker** 

The project uses Docker and docker-compose for both application development and deployment.

#### **Prerequisites**
Windows users only:
- Enable WSL [https://docs.microsoft.com/en-us/windows/wsl/install](https://docs.microsoft.com/en-us/windows/wsl/install)

#### **Installation**

The project requires two installations:
- Docker Engine [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
- Docker Compose [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

Those that prefer buttons over the command line may also consider installing Docker Desktop:
- Windows [https://docs.docker.com/desktop/windows/install/](https://docs.docker.com/desktop/windows/install/)
- Apple [https://docs.docker.com/desktop/mac/install/](https://docs.docker.com/desktop/mac/install/)

#### **Guides**
The official [documentation](https://docs.docker.com/) provides an abundance of guides ranging over all skill levels. Useful links:  

*Quick Start*
- [Getting started with Docker](https://docs.docker.com/get-started/)
- [Getting started with Docker Compose](https://docs.docker.com/compose/gettingstarted/)

*Relevant Specific Topics*
- [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
- [Dockerfile multistage build](https://docs.docker.com/develop/develop-images/multistage-build/)
- [Environment variables in Compose](https://docs.docker.com/compose/environment-variables/)
- [Multiple docker-compose files](https://docs.docker.com/compose/extends/)
- [Compose file build reference](https://docs.docker.com/compose/compose-file/build/)

[back to contents](#contents)

#### **Services**
The three compose files define six services for running the application.  

- `docker-compose.yml` - these services use the same configuration for both development and production:
    - `postgres` - Runs the database maintaining application data. 
    - `migration` - Runs migration scripts on the `postgres` service. Includes the initialization script.  
- `docker-compose.override.yml` - defines configurations for development build:
- `docker-compose.prod.yml` - defines configurations for the production build:
    - `backend` - Runs the API to interact with the `postgres` service.
    - `ml-server` - Runs the API to access the machine learning models.
    - `ml-scheduler` - Sends recurring requests to the `backend` and the `ml-server` to get predictions for patients stored in the database.
    - `frontend` - Runs the UI to interact with the data in the `backend` service.

Each service, except the `postgres` service, builds an image from the specified context. The default `Dockerfile` in the service's context defines the image for the development environment. The `migration` and `ml-scheduler` services also use the default `Dockerfile` for the production build. The other services use `Dockerfile.prod` to build the production images.

The `docker-compose` files tags the images with a mirror repository owned by the original team to enable pushing/pulling the images to a registry when deploying. Replace this path, `registry.gitlab.com/g5003/predicting-patient-issues-mirror`, with a container repository owned by the current team.

[back to contents](#contents)

---

### **Development**

**Configuration**

Use the following environment files for the development build.

- `.env`
    ```
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=password
    POSTGRES_DB=userinfo
    ```
- `backend/settings.ini`
    ```
    [DatabaseSettings]
    Endpoint = postgres
    Port = 5432
    User = postgres
    Password = password
    Database = userinfo

    [AuthSettings]
    Secret = SECRET
    ```
    *disambiguation - `Endpoint=postgres` refers to the `postgres` service in `docker-compose.yml` and `User=postgres` refers to the username to log in to the database.
- `/ml-scheduler/code/.env`
    ```
    PATIENT_SERVER=http://backend:8000
    ML_SERVER=http://ml-server:8000
    TOKEN=null
    USERNAME=admin
    PASSWORD=pass123
    ```
- `frontend/.env`
    ```
    PORT=5000
    REACT_APP_API_BASE_URL=http://localhost:8000
    ```

- `postgres/.env`
    ```
    DATABASE_URL="postgres://postgres:password@postgres:5432/userinfo?sslmode=disable"
    ```

Note that several variables reference the database password and must use the same value or the application will break.  

- Variables referencing the password for the postgres database:
    - `.env.POSTGRES_PASSWORD`
    - `backend/settings.ini.Password`
    - `/postgres/.env.DATABASE_URL`


**Usage**

Useful commands. Set working directory to project root.
- Build all images with development configuration:
    ```
    docker-compose build
    ```
- Build a single image with development configuration:
    ```
    docker-compose build [SERVICE]
    ```
- Start all containers in development mode:
    ```
    docker-compose up
    ```
- Start a single container in development mode:
    ```
    docker-compose up [SERVICE]
    ```
- Stop all running containers:
    ```
    docker-compose down
    ```
- Stop a single container:
    ```
    docker-compose down [SERVICE]
    ```
- Navigate browser to [http://localhost:5000](http://localhost:5000) to access development build

**Developing Code**

`docker-compose.override.yml` mounts an external volume for each service that maps the source code on the local machine to the source code inside the container. When ever the code changes locally, the contents inside the container update automatically. Containers that support hot-reloading (`backend`, `frontend`, `ml-server`) will apply changes while the application is running. `ml-scheduler` requires a restart to apply changes. `migration` requires rebuilding the image and then a restart to apply changes.

`docker-compose.yml` mounts an internal volume to persist data in the `postgres` service between application shutdown/startup. Removing the volume will wipe the database.  
```
docker-compose down -v
```
After removing the volume, the migration container will apply all scripts next time the service starts.

**Testing**

The backend contains a `tests.py` that performs a few integrated tests on the API routes. Build and run the application with the `docker-compose.test.yml` file to execute the tests. 

[back to contents](#contents)

---

### **Deployment**

**Configuration**

Some environment files require modification for the production build.

- `frontend/.env`
    ```
    PORT=5000
    REACT_APP_API_BASE_URL=http://04.csc.tntech.edu
    ```
    At the time this documentation was written, `04.csc.tntech.edu` hosted the application. Update the url as needed. Note that using `localhost` worked when tested locally but resulted in CORS errors when running the application on the TTU server.

- `/ml-scheduler/code/.env`
    ```
    PATIENT_SERVER=http://frontend
    ML_SERVER=http://frontend
    TOKEN=null
    USERNAME=admin
    PASSWORD=pass123
    ```
    The production build routes all requests through the `frontend` where the `nginx` server fowards requests to the other containers.

**Production Build**

Simply specify the production build file and docker will handle the rest.
```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
```
If testing the production build locally, open a browser and access the application at `http://localhost`

**Requirements**
- Server Configuration - The host should have both docker and docker-compose installed. Team members should have the ability to ssh into the server and execute docker commands from a terminal
- Image Repository - The team should own a docker image repository to push/pull the images required to run the application. The orginal team set up a Gitlab mirror with a personal account and used the container registry in the mirror repository due to complications with TTU Gitlab account. Suggestion: use a personal repository from the beginning to avoid repeating issues the original team encountered. Gitlab offers students personal accounts with private repositories and container registries.

**Deploy**

Deployment involves these high-level steps:
- Build the production images
- Push the images to a repository
- Pull the images onto the server
- Start the services

The first two points are covered above. The simplest method for the second two steps consists of creating a `docker-compose.yml` file on the server and specifying the registry and tag for each service. Then a simple `docker-compose up` will pull the images from the repository and start them. Refer to `docker-compose.iteration-6.yml` for the file used by the original team to deploy the final iteration release. As mentioned in the [docker](#docker) section, the current team needs to update the path to the image repository in the `docker-compose` files.

**Troubleshooting**

100% of deployment issues experienced by the orginal team related to variables in the environment files.