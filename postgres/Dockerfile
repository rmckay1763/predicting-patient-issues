# docker build file for database migrations

# base image for dbmate
FROM amacneil/dbmate:latest

# set working directory
WORKDIR /app/dbmate

# copy src files
COPY . .

# run migration scripts
CMD [ "--wait", "migrate" ]
