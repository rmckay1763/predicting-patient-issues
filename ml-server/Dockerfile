# docker build file for ml server

# base python image
FROM python:3.9

# set backend directory
WORKDIR /app

# add source code
COPY . .

# install dependencies
RUN \
    pip3 install --upgrade pip && \
    pip3 install pipreqs && \
    pipreqs --force . && \
    pip3 install --no-cache-dir --upgrade -r requirements.txt && \
    pip3 install uvicorn

# expose port for api
EXPOSE 8000

# start api service
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]