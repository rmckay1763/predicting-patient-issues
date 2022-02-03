# docker build file for frontend development

# base nodejs image
FROM node:latest

# set frontend directory
WORKDIR /app/frontend

# add dependencies files
COPY package.json ./

# install dependencies
RUN npm install

# add source code
COPY . .

# expose port for frontend
EXPOSE 5000

# start frontend app
CMD [ "npm", "start" ]