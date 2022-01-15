# base python image
FROM python:3.9

# set backend directory
WORKDIR /app/backend

# add dependencies file
COPY requirements.txt .

# install dependencies
RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

# add source code
COPY . .

# expose port for api
EXPOSE 8000

# start api service
CMD [ "python3", "main.py"]