FROM python:3.9

WORKDIR /code

# add source code
COPY code .

# install dependencies
RUN \
    pip3 install --upgrade pip && \
    pip3 install pipreqs && \
    pipreqs --force . && \
    pip3 install --no-cache-dir --upgrade -r requirements.txt

CMD python3 driver.py