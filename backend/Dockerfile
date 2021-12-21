# base python image
FROM python:3.9

# add modules
RUN \
    pip3 install pipreqs

# set backend directory
WORKDIR /app/backend

# add source code
COPY . .

# install backend dependencies
RUN \
    python3 -m pipreqs.pipreqs . --force && \
    pip3 install -r requirements.txt

# expose port for api
EXPOSE 8000

# start api service
CMD [ "python3", "main.py"]