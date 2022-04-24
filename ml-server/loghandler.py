from typing import Any
import logging
from logging.handlers import RotatingFileHandler

class LogHandler:
    '''
    Provides logging with rotating files to manage long running logs. 
    Writes to next file in rotation when log reaches specified size.
    '''

    REGULAR: int = 0
    '''
    Represents regular format for log output:
        YY-MM-DD HH:MM:SS - logger name - log level - log message
    '''
    PLAIN: int = 1
    'Represents plain format for log output: message only'

    DEBUG: int = logging.DEBUG
    'Debug log level for logging messages'
    INFO: int = logging.INFO
    'Info log level for logging messages'
    WARNING: int = logging.WARNING
    'Warning log level for logging messages'
    ERROR: int = logging.ERROR
    'Error log level for logging messages'
    CRITICAL: int = logging.CRITICAL
    'Critical log level for logging messages'

    regularFormatter = logging.Formatter(
        fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt= '%Y-%m-%d %H:%M:%S'
    )
    plainFormatter = logging.Formatter('%(message)s')
    formatters = {REGULAR: regularFormatter, PLAIN: plainFormatter}

    def __init__(
        self,
        name: str,
        logFile: str,
        level = logging.INFO,
        numLogs = 1,
        logSize = 1e6,
    ) -> None:
        '''
        Constructor.
        
        Parameters:
            name - The name of the logger.

            logFile - Name of log file. Final path will be /var/log/logFile.

            level - Minimum level of events to log. Default logging.INFO
                possible values: LogHandler.DEBUG|INFO|WARNING|ERROR|CRITICAL

            numLogs - Number of files in rotation. Default 1.

            logSize - Limit (bytes) before writing to next log in rotation: Default 1e6.
        '''
        self.format = self.REGULAR
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        if self.logger.handlers: return
        handler = RotatingFileHandler(
            filename = '/var/log/' + logFile,
            maxBytes = logSize,
            backupCount = numLogs
        )
        handler.setLevel(level)
        self.logger.addHandler(handler)
        self._setFormat()

    def _setFormat(self) -> None:
        'Sets the formatter to use with the log handler'
        handler = self.logger.handlers[0]
        handler.setFormatter(self.formatters.get(self.format))

    def log(self, message: Any, level: int, format: int = REGULAR) -> None:
        '''
        Logs a message to the current log file.

        Parameters:
            message - The message to log.

            level - The log level of the message.
                possible values: LogHandler.DEBUG|INFO|WARNING|ERROR|CRITICAL

            format - The format to use. Default LogHandler.REGULAR.
                possible values: LogHandler.REGULAR|PLAIN
        '''
        if format not in self.formatters.keys():
            raise ValueError(f'{format} is not a valid format option')
        if format is not self.format:
            self.format = format
            self._setFormat()
        self.logger.log(level=level, msg=message)