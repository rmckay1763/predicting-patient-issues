# Postgres Migrations Container

**IMPORTANT! Please read the top level README first**

### **Contents**

- [Synopsis](#synopsis)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Usage](#usage)

---

### **Synopsis**

Runs migrations on the PostgreSQL instance storing application data. Contains an initialization script to build the database and populate with some pre-defined values. Uses the [dbmate](https://hub.docker.com/r/amacneil/dbmate) docker image.  

*Disambiguation - this folder contains the source files for the `migration` service defined in `docker-compose.yml` which is not to be confused with the separate `postgres` service.*

[back to contents](#contents)

---

### **Architecture**

The migration container simply uses a pre-built docker image and copies SQL scripts into a specified folder. On start-up, the container will search the folder for any scripts not yet applied to the database and execute them. The container will then exit.

[back to contents](#contents)

---

### **File Structure**

`/postgres`
- `/db/migrations` - folder for SQL scripts to apply to database.
- `.env` - environment file with database connection settings.
- `Dockerfile` - build file.

[back to contents](#contents)

---

### **Usage**

Please refer to the documentation for the [dbmate](https://hub.docker.com/r/amacneil/dbmate) docker image first for an understanding of how dbmate applies migrations. The development environment and production build both use the same `Dockerfile` for the migration image. The container will run upon application start up and then exit after applying any new scripts. Note that dbmate runs scripts in order of file name, so the name of a script file should began with a timestamp to ensure scripts execute in the desired order. To add a new script:  
- Create a new file in `/db/migrations` named `[currrent_timestamp]_[purpose].sql` where `current_timestamp` is `YYYYMMDDhhmmss` and `purpose` is a descriptive name for the purpose of the script.
- Place the SQL in between the following lines: 
    ``` 
    -- migrate:up  

    -- migrate:down
    ```
- Rebuild the migration image to include the new script:
    ```
    docker-compose build migration
    ```
- The container will apply the new script next time it starts up. Note that the migration container can apply a script to the database while the application is running (use with caution to avoid breaking changes) by opening a new terminal and starting the container:
    ```
    docker-compose up migration
    ```

[back to contents](#contents)