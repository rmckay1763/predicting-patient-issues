# Predicting Patient Issues

#### Contents

- [Backend](#backend)
- [Frontend](#frontend)
- [Docker](#dockerized-development-environment)

---

#### Backend

##### Requirements for Python development

- Python3
- pip3

For dependency installation, use the pipreqs module to generate a requirements.txt

Use this command to install pipreqs:
`pip3 install pipreqs`

Once the pipreqs module is installed, move the current working directory to `/backend` and generate the requirements.txt by:
`python3 -m pipreqs.pipreqs .`

To install modules from requirements.txt, run this command:
`pip3 install -r requirements.txt`

This will install all necessary Python modules to run the backend service. Make sure to do this process with each fetch/pull.

##### FastAPI for userinfo database

The api provides routes to interact with each table in the userinfo database.
- Each table has a class that implements basic CRUD operations.
- Each table has a class that implements an APIRouter for the table routes.
- The class for the main api adds the APIRouters to the FastAPI.

Refer to the router classes located at `backend/api/[database_name]/routers/` for available routes.

Operation:
- Change working direction to `/backend`
- Uncomment lines in `main.py` to start in desired mode
- Run `python3 main.py` to start the service
- Stop the service with `ctrl + c`

[back to contents](#contents)

---

#### Frontend

##### Requirements for ReactJS development:

- NodeJS runtime
- npm (NodeJS package manager)

NodeJS/npm documentation & installation: [https://nodejs.org/en/](https://nodejs.org/en/)

ReactJS documentation: [https://reactjs.org/](https://reactjs.org/)

##### Running ReactJS frontend

After installing the requirements listed above, move the current working directory to /frontend.

If it is the first time running this project (after initially pulling code), you will not have the _node_modules_ folder. Install the npm requirements found in the _package.json_ file: `npm install`. If you already have the _node_modules_ folder, you can skip the previous step.

Start the development server: `npm start`

The development server should be accessible at [http://localhost:3000](http://localhost:3000).

[back to contents](#contents)

---

#### Dockerized Development Environment

*This is the recommend method for application development*

**Synopsis**

The dockerized application provides a completely containerized and isolated environment to develop and test code.

**Prerequisites**

- Docker Engine [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
- Docker Compose [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

**Configuration**

Use the following configuration files for development:

- `backend/settings.ini`
    ```
    [DatabaseSettings]
    Endpoint = postgres
    Port = 5432
    User = postgres
    Password = password
    Database = userinfo

    [SSHTunnelSettings]
    UseTunnel = False 

    [AuthSettings]
    Secret = SECRET
    ```
- `frontend/.env` *Note: use port 80 for production build*
    ```
    PORT=5000
    REACT_APP_API_BASE_URL=http://localhost:8000
    ```

- `postgres/.env`
    ```
    DATABASE_URL="postgres://postgres:password@postgres:5432/userinfo?sslmode=disable"
    ```
- `backend/requirements.txt`
    ```
    fastapi==0.72.0
    passlib==1.7.4
    psycopg2==2.9.3
    pydantic==1.9.0
    PyJWT==2.3.0
    sshtunnel==0.4.0
    uvicorn==0.17.0
    ```

**Database Migrations**

- The `migration` container will run `.sql` scripts on `docker-compose up`
- Place `.sql` scripts in `postgres/db/migrations`
- Refer to dbmate [documentation](https://github.com/amacneil/dbmate#creating-migrations) for script format

**Operation**

- Navigate to project root directory
- Run: `docker-compose up` to start the app in development mode
- Navigate browser to [http://localhost:5000](http://localhost:5000) to access development build
- RUN: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up` for production mode
- Navigate browser to [http://localhost](http://localhost) to access production build
- Run: `docker-compose down` in a new terminal to stop the app

[back to contents](#contents)