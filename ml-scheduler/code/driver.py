import time
import asyncio
from dotenv import load_dotenv
from threading import Thread
import schedule
from requests.exceptions import HTTPError, ConnectionError, RequestException
from apihandler import APIHandler
from loghandler import LogHandler

load_dotenv()
api = APIHandler()
logger = LogHandler('scheduler_logger', 'scheduler.log')

def handleException(err: RequestException):
    '''
    Logs the exception.
    '''
    detail = err.response.text if type(err) is HTTPError else ''
    message = f'{err}: {detail}'
    logger.log(message, level=LogHandler.ERROR)

async def task() -> None:
    '''
    get predictions for each patient and update status in backend.
    '''
    try:
        await api.checkToken()
        await api.checkMLServer()
        patients = await api.fetchPatients()
    except HTTPError as err:
        handleException(err)
        return
    except ConnectionError as err:
        handleException(err)
        return
    for patient in patients:
        try:
            vitals = await api.fetchVitals(patient.pid, 5)
            prediction = await api.getPrediction(vitals)
            await api.updateStatus(patient.pid, prediction.status.id)
        except HTTPError as err:
            handleException(err)
            continue
        except ConnectionError as err:
            handleException(err)
            continue

def awaitTask() -> None:
    '''
    Wraps above function (task) with async loop to enable threading.
    '''
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(task())
    loop.close()

def runTask() -> None:
    '''
    Runs the task function in an isolated thread.
    '''
    thread = Thread(target=awaitTask)
    thread.start()

if __name__ == '__main__':
    schedule.every(10).seconds.do(runTask)
    '''
    uncomment to make recurring calls to the model api
    '''
    while True:
        schedule.run_pending()
        time.sleep(1)
