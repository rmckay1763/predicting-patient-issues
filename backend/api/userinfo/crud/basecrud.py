from typing import Any, List
import abc
from pydantic import BaseModel
from api.utils.postgresconnector import PostgresConnector

class BaseCRUD(abc.ABC):
    """
    Base clase for utility classes that interact with tables in the database.

    Attributes:
        conn (PostgresConnector): a psycopg2 connection to the database.
    """

    def __init__(self, connector: PostgresConnector) -> None:
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
    async def fetchKey(self, value: Any) -> dict:
        """
        Fetch the primary key of an entity given a value for a specified column.

        Paremeters:
            value (Any): The entry's value for the specified column.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            dict: Primary key as a dictionary.
        """
        pass

    @abc.abstractmethod
    async def fetchAll(self) -> List[BaseModel]:
        """
        Fetch all entries from the table.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            list[BaseModel]: All entries from the table as a list of models.
        """
        pass

    @abc.abstractmethod
    async def fetchOne(self, key: int) -> BaseModel:
        """
        Fetch one row from the table given the primary key.

        Parameters:
            key (int): The primary key for the entity to fetch.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            BaseModel: Model representing the selected entity.
        """
        pass

    @abc.abstractmethod
    async def insert(self, model: BaseModel) -> dict:
        """
        Insert a new entry into the table.

        Parameters:
            model (BaseModel): The entity to insert.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            dict: Primary key of the new entry as a dictionary.
        """
        pass

    @abc.abstractmethod
    async def update(self, update: BaseModel) -> BaseModel:
        """
        Update a entry in the table.

        Parameters:
            updated (BaseModel): The updated model.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            BaseModel: The result of the update.
        """
        pass

    @abc.abstractmethod
    async def delete(self, key) -> bool:
        """
        Delete a row from the table.

        Parameters:
            key (int): The primary key of the row to delete.

        Raises:
            HTTPException: If query fails or result is null.

        Returns:
            bool: True upon successful deletion.
        """
        pass