from api.driver import APIDriver

# get a fastapi instance in the main module
app = APIDriver.getInstance()

# start api in development mode
# if __name__ == "__main__":
#    APIDriver.startDevMode()

# start api in deployment mode.
# APIDriver.start()

# kill deployment api by issing following command in terminal:
# 'pkill gunicorn'