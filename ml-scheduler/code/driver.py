import time
import asyncio
from dotenv import load_dotenv
from threading import Thread
import schedule
from apihandler import APIHandler

load_dotenv()
api = APIHandler()

async def task() -> None:
    '''
    function for testing
    '''
    if not await api.checkToken(): return None
    patients = await api.fetchPatients()
    for patient in patients:
        vitals = await api.fetchVitals(patient.pid, 5)
        status = await api.getPrediction(patient, vitals)
        await api.updateStatus(patient.pid, status)
    log = open('/var/log/scheduler.log', 'a')
    print(status, file=log)
    print(patient, file=log)
    print(vitals, file=log)
    log.close()

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
