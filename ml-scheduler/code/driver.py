import time
from dotenv import load_dotenv
import schedule
from apihandler import APIHandler
from dataprocesssor import DataProcessor

load_dotenv()
api = APIHandler()

def test():
    '''
    function for testing
    '''
    api.checkToken()
    patients = api.fetchPatients()
    for patient in patients:
        vitals = api.fetchVitals(patient.pid, 3)
        data = DataProcessor(patient, vitals)
        data.setOffsets()
        data.parseVitals()
    log = open('/var/log/scheduler.log', 'a')
    print(data.offsets, file=log)
    log.close()

if __name__ == '__main__':
    schedule.every(10).seconds.do(test)
    # while True:
    #     schedule.run_pending()
    #     time.sleep(1)
