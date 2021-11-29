import abc
from pydantic import BaseModel
from api.utils.postgresconnector import PostgresConnector

class BaseCRUD(abc.ABC):
    """
    Base clase for utility classes that interact with tables in the database.

    Attributes:
        conn (PostgresConnector): a psycopg2 connection to the database.
    """

    def __init__(self, connector: PostgresConnector):
        """
        Constructor.

        Paratmeters:
            conn (PostgresConnector): Psycopg2 connection to get cursors from.
        """
        self.connector = connector

        # parameterezed strings for sql queries.
        # insert/update query not general so derived class must define.
        self.fetchKeyQuery = "SELECT {key} FROM public.{table} WHERE {column} = %s;"
        self.fetchAllQuery = "SELECT * FROM public.{table};"
        self.fetchOneQuery = "SELECT * FROM public.{table} WHERE {key} = %s;"
        self.deleteQuery = "DELETE FROM public.{table} WHERE {key} = %s;"

    @abc.abstractmethod
    async def fetchKey(self, value):
        """
        Fetch the primary key of a table entry given a value for a specified column.

        Paremeters:
            value (Any): The entry's value for the specified column.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            RealDictRow: The name of the primary key column and its value.
        """
        pass

    @abc.abstractmethod
    async def fetchAll(self):
        """
        Fetch all entries from the table.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            list: A list of table objects (descended from BaseModel).
        """
        pass

    @abc.abstractmethod
    async def fetchOne(self, key: int):
        """
        Fetch one row from the table given the primary key.

        Parameters:
            key (int): The primary key for the row to fetch.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            BaseModel: The row as a table object (descended from BaseModel).
        """
        pass

    @abc.abstractmethod
    async def insert(self, model: BaseModel):
        """
        Insert a new row into the table.

        Parameters:
            model (BaseModel): The row to insert as a table_in model (descended from BaseModel).

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            RealDictRow: The name of the new row's primary key column and its value.
        """
        pass

    @abc.abstractmethod
    async def update(self, update: BaseModel):
        """
        Update a row in the table.

        Parameters:
            updated (BaseModel): The updated model (descended from BaseModel).

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            BaseModel: The result of the update.
        """
        pass

    @abc.abstractmethod
    async def delete(self, key):
        """
        Delete a row from the table.

        Parameters:
            key (int): The primary key of the row to delete.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            bool: True upon successful deletion, false otherwise.
        """
        pass