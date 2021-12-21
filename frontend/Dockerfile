# base nodejs image
FROM node:16

# set frontend directory
WORKDIR /app/frontend

# install app dependencies
COPY package*.json ./
RUN npm install -s

# add source code
COPY . .

# expose port for frontend
EXPOSE 3000

# start frontend app
CMD [ "npm", "start" ]