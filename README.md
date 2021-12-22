# Predicting Patient Issues

For dependency installation, use the pipreqs module to generate a requirements.txt

Use this command to install pipreqs:
`pip3 install pipreqs`

Once the pipreqs module is installed, move the current working directory to /api and generate the requirements.txt by:
`python3 -m pipreqs.pipreqs .`

To install modules from requirements.txt, run this command:
`pip3 install -r requirements.txt`

This will install all necessary Python modules to run the backend service. Make sure to do this process with each fetch/pull.

---

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

##### FastAPI for userinfo database

Update dependencies if necessary (see above).

The api provides routes to interact with each table in the userinfo database.

    * Each table has a class that implements basic CRUD operations.
    * Each table has a class that implements an APIRouter for the table routes.
    * The class for the main api adds the APIRouters to the FastAPI.

Refer to the router classes located at backend/api/[database_name]/routers/ for available routes.

The main.py file located in backend/ will start the service.
    * Uncomment the lines to start the service in the desired mode (development or deployment).

---

#### Dockerized Development Environment

*This is the recommend method for application development*

**Synopsis**
The dockerized application provides a completely containerized and independent environment to develop and test code.

**Prerequisites**
- Docker Engine [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
- Docker Compose [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

**Preparation**
- Modify `backend/settings.ini`:
set `[DatabaseSettings]:Endpoint = postgres`
set `[SSHTunnelSettings]:UseTunnel = False`
- Verify `backend/main.py` set to start app in development mode
- Verify existence of `frontend/.env` file

**Operation**
- Navigate to project root directory
- Run: `docker-compose up` to start the app
- Navigate browser to [http://localhost](http://localhost) to access app
- Stop app with `ctrl + c` 

