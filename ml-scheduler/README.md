# ML Scheduler Container

**IMPORTANT! Please read the top level README first**

### **Contents**

- [Synopsis](#synopsis)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Development](#development)
- [Deployment](#deployment)

---

### **Synopsis**

Schedules recurring calls to predict the status of each patient in the backend database. The sole purpose of this container consists of connecting the backend container with the ml server container. The `driver.py` file makes calls to the backend to get patient data, calls the predict route of the ml server container for each patient, and updates the status of the patient in the backend based on the prediction.

[back to contents](#contents)

---

### **Architecture**

The scheduler uses the Python [schedule](https://schedule.readthedocs.io/en/stable/index.html) module to make recuring calls to a `task` function in `driver.py` that gets predictions for each patient in the backend database. The schedule module only supports serial execution out of the box. However, Using an [event loop](https://docs.python.org/3/library/asyncio-eventloop.html) and a [Thread](https://docs.python.org/3/library/threading.html#thread-objects) allows the `task` to run as an async function. The scheduler operates with a simple design:
- **API Models**  
`apimodels.py` defines [pydantic](https://pydantic-docs.helpmanual.io/) data models for orm mapping.
- **API Handler**  
`apihandler.py` provides functions to make HTTP [requests](https://docs.python-requests.org/en/latest/) to the backend and the ml server.
- **Log Handler**  
`loghandler.py` wraps the Python [logging](https://docs.python.org/3/howto/logging.html) module to provide a convient system for rotating logs.
- **Driver**  
`driver.py` uses the previous components to schedule the recurring tasks.

[back to contents](#contents)

---

### **File Structure**

`/ml-scheduler`
- `Dockerfile` - build file (development and production).
- `/code` - directory for source files.
    - `.env` - environment variables.
    - `apihandler.py` - handles HTTP requests.
    - `apimodels` - defines orm models.
    - `driver.py` - driver file.
    - `loghandler.py` - handles logging.

[back to contents](#contents)

---

### **Development**

The build file `Dockerfile` will build a [Python](https://hub.docker.com/_/python) based image and execute the script in the `driver.py` file. The script will run continously, executing the scheduled tasks in the specified interval. Unlike other containers, the scheduler does not support hot reloading in development mode. Thus, restart the container with 
```
docker-compose restart ml-scheduler
``` 
to apply changes. Updating import statements requires rebuilding the image.

[back to contents](#contents)

---

### **Deployment**

The production build uses the same `Dockerfile` as the development build. However, production requires different values for the server variables in the `.env` file since the application routes all requests through the frontend nginx server in production mode:
- `PATIENT_SERVER=http://frontend`
- `ML_SERVER=http://frontend`

Make sure to update these variables with the above values before building the production container.

[back to contents](#contents)