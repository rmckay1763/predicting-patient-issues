# ML Server Container

**IMPORTANT! Please read the top level README first**

### **Contents**

- [Synopsis](#synopsis)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Usage](#usage)

---

### **Synopsis**

Decoupled API to access machine learning models. Implements a Python [FastAPI](https://fastapi.tiangolo.com/) application with integrated machine learning models to predict future vitals and status from a time seriers of previous vitals.

[back to contents](#contents)

---

### **Architecture**

The ML Server uses several layers of abstraction to provide a `/predict` HTTP route that expects a time series of five sets of vitals and returns the predicted future vitals and status:
- **Tensorflow Models**  
Each model is stored as a [SavedModel](https://www.tensorflow.org/guide/keras/save_and_serialize) in a directory `[vitalname]_model` where vitalname is the vital that the model predicts. To update a model, simply replace the model's folder with the updated folder.
- **Model Handler**  
The `ModelHandler` class loads each `SavedModel` and provides a function to call its [predict](https://www.tensorflow.org/api_docs/python/tf/keras/Sequential#predict) method. The functions in this class expect a time series of a single vital and return the predicted future vital. e.g. `ModelHandler.predictHeartRate()` expects the five previous heart rates and returns the predicted next heart rate.
- **Data Processor**  
The `DataProcessor` class processes the input passed via the `/predict` HTTP route and prepares the data for the machine learning models.
- **Model Service**  
The `ModelService` class uses a `DataProcessor` to prepare the input and the `ModelHandler` to predict future vitals. The `ModelService` also provides a function to check the predicted future vitals and return a `Status`.
- **FastAPI**  
`main.py` implements a simple `FastAPI` application with a `/health` route and a `/predict` route. The `predict` route expects a time series of vitals as input and uses the `ModelService` to predict future vitals and status.

[back to contents](#contents)

---

### **File Structure**

`/ml-server`
- `Dockerfile` - default build file for development environment.
- `Dockerfile.prod` - build file for production build.
- `apimodels` - defines orm models.
- `dataprocessor.py` - defines the `DataProcessor` class.
- `modelhandler.py` - defines the `ModelHandler` class.
- `modelservice.py` - defines the `ModelService` class.
- `loghandler.py` - handles logging.
- `main.py` - implements `FastAPI` app.
- `/[vital]_model` - Tensorflow `SavedModel` folders

[back to contents](#contents)

---

### **Development**

The `Dockerfile` build file will build a [Python](https://hub.docker.com/_/python) based image and start the FastAPI in development mode. The docker-compose setup uses a volume so that any changes on the local machine update the code inside the running docker container. The development mode for fastapi uses hot reloading, so simply modify the code locally and watch the changes get applied inside the container! Note that the development set up runs the ML Server on `localhost:8001` (the container runs the app on port 8000 but the docker-compose file maps `localhost:8001` to port 8000 of the container). To test the HTTP routes, use a service such as [postman](https://www.postman.com/downloads/).

[back to contents](#contents)

---

### **Deployment**

The `Dockerfile.prod` build file will build a [Python](https://hub.docker.com/_/python) based image and start the FastAPI in production mode on port 80 with [gunicorn](https://fastapi.tiangolo.com/deployment/server-workers/). The current docker-compose production setup routes all requests to the frontend where an `nginx` server forwards requests to other containers as needed (see the README for the frontend). Note that `Dockerfile.prod` exposes port 80, so simply map any desired port on local host (or the machine running the ML server) to port 80 of the ML Server container to access the ML API independently.

[back to contents](#contents)

---

### **Usage**

Any application that adheres to the HTTP protocal can make by a request to the Ml server. The endpoint will be the address of the machine hosting the application plus `/predict` (e.g. `http://www.somedomain.com/predict`). The route expects a time series of sets of vital signs in descending order (most recently recorded on top) passed in via the body of the request. Each set of vitals should include the following keys:
- `heart_rate`
- `respiration`
- `sao2`
- `systolic`
- `diastolic`

The response will consist of a JSON object with a `vitals` key and a `status` key. The value for the `vitals` key consists of the predicted future vitals and the value for the `status` key consists of an object with a `id` key and a `text` key. Possible `status` objects currently include:
- Normal
    ```
    "id": 9,
    "text": "Normal"
    ```
- Alert
    ```
    "id": 1,
    "text": "Alert"
    ```

Example input and response:  
- Example post body
    ```
    [
        {
            "heart_rate": 84,
            "respiration": 26,
            "sao2": 96,
            "systolic": 93,
            "diastolic": 47
        },
        {
            "heart_rate": 84,
            "respiration": 26,
            "sao2": 9,
            "systolic": 93,
            "diastolic": 47
        },
        {
            "heart_rate": 84,
            "respiration": 26,
            "sao2": 94,
            "systolic": 93,
            "diastolic": 47
        },
        {
            "heart_rate": 78,
            "respiration": 26,
            "sao2": 93,
            "systolic": 88,
            "diastolic": 45
        },
        {
            "heart_rate": 77,
            "respiration": 21,
            "sao2": 96,
            "systolic": 91,
            "diastolic": 46
        }
    ]
    ```
- Example response
    ```
    {
        "vitals": {
            "heart_rate": 84,
            "sao2": 105,
            "respiration": 26,
            "systolic": 94,
            "diastolic": 47
        },
        "status": {
            "id": 9,
            "text": "Normal"
        }
    }
    ```