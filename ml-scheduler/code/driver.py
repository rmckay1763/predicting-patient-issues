import time
import asyncio
from dotenv import load_dotenv
from threading import Thread
import schedule
from requests.exceptions import HTTPError, ConnectionError, RequestException
from apihandler import APIHandler

load_dotenv()
api = APIHandler()

def handleException(err: RequestException):
    '''
    Logs the exception.
    '''
    detail = err.response.text if type(err) is HTTPError else ''
    log = open('/var/log/scheduler.log', 'a')
    print(err, detail, file=log)
    print()
    log.close()

async def task() -> None:
    '''
    function for testing
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
            status = await api.getPrediction(patient, vitals)
            await api.updateStatus(patient.pid, status.id)
        except HTTPError as err:
            handleException(err)
            continue
        except ConnectionError as err:
            handleException(err)
            continue

def awaitTask() -> None:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(task())
    loop.close()

def runTask() -> None:
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
