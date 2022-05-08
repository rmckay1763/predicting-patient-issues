# Backend Container

**IMPORTANT! Please read the top level README first**

### **Contents**

- [Synopsis](#synopsis)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Development](#development)
- [Deployment](#deployment)

---

### **Synopsis**

Provides HTTP endpoints for the frontend to interact with the PostgreSQL database maintaining application data. Implements a Python [FastAPI](https://fastapi.tiangolo.com/) application with an object oriented modular design.

[back to contents](#contents)

---

### **Architecture**

The application follows object oriented principles, providing several layers of abstraction and modularity to separate concerns.
- **Utility Layer**  
Utility classes handle core functionality required by higher layers. These classes provide convience functions to access the required utilities. Examples include database connectors and authentication handlers.
- **CRUD (Create, Read, Update, Delete) Layer**  
The CRUD classes provide functions to perform the basic operations on a table in the database. Each table in the `userinfo` database has a corresponding CRUD class, derived from the parent `BaseCRUD` class. These classes should only implement basic insert, select, update, and delete operations.
- **Service Layer**  
The service layer provides a layer on top of the CRUD classes to handle logic required by the frontend. A service class provides functions to access/update related data. Functions in the service classes call functions from the CRUD classes and handle any mapping of frontend data models to database table data models. The application currently contains a `UserService` class for handling data related to application users and a `PatientService` class for handling data related to patients maintained by the application.
- **Router Layer**  
The router layer exposes functions in the service layer by providing HTTP routes for the frontend to access. The sole purpose of this layer consists of providing API endpoints for the functions in the service class needed by the frontend. Each service class has a corresponding router class.

[back to contents](#contents)

---

### **File Structure**

`/backend`
- `Dockerfile` - build file for development environment.
- `Dockerfile.prod` - build file for production environment.
- `settings.ini` - environment file with database and security settings.
- `main.py` - entry point for application.
- `/api` - directory
    - `dependencies.py` - global objects used throughout app.
    - `mainapi.py` - top level fastapi application.
    - `driver.py` - class to create an instance of the fastapi app.
    - `/utils` - directory
        - `authhandler.py` - utility class for authentication.
        - `postgresconnector.py` - utility class for connecting to database.
    - `/userinfo` - directory *note this is a misleading name as it contains both user info and patient info related files.
        - `models.py` - definitions of data models for orm mapping.
        - `/crud` - directory: contains a crud class for each table in the database.
        - `/services` - directory: contains service classes for related tables.
        - `/router` - directory: contains a router class for each service class.


[back to contents](#contents)

---

### **Development**

The default build file `Dockerfile` will build a Python based image and start the fastapi app in development mode. The docker-compose setup uses a volume so that any changes on the local machine update the code inside the running docker container. The development mode for fastapi uses hot reloading, so simply modify the code locally and watch the changes get applied inside the container! Note that the development set up runs the backend on `localhost:8000`. To test new HTTP routes, use a service such as [postman](https://www.postman.com/downloads/).

[back to contents](#contents)

---

### **Deployment**

The production build file `Dockerfile.prod` will build an [image](https://github.com/tiangolo/uvicorn-gunicorn-fastapi-docker) optimized to run fastapi with gunicorn. No configuration files need updating for the production build. Noticeable changes from development envirnment include:
- The dockerfile does not expose any ports so cannot hit the container directly. Refer to the frontend `README.md` for information on server configuration.
- The production build does not use volumes so local changes to code will not affect the running container. Rebuild the image to apply any changes.

[back to contents](#contents)