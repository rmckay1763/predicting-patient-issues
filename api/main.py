import configparser
import models as m
from postgresconnector import PostgresConnector
from pydantic import parse_obj_as
from typing import List

def main():
    # Read Config file into Parser
    config = configparser.ConfigParser()
    config.read('settings.ini')
    config.sections()

    # Create PostgresConnector
    conn = PostgresConnector(config)

    # Execute Query and Print Results
    conn.curr.execute('SELECT * FROM diagnosis LIMIT(100);')
    resultDict = conn.curr.fetchall()

    # Parse dictionary as array of Diagnosis models
    models = parse_obj_as(List[m.Diagnosis], resultDict)

    print(models)

main()