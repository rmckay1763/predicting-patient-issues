import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta

    
class AuthHandler:
    '''
    Handles various authentication protocols.
    '''
    security = HTTPBearer()
    context = CryptContext(schemes=['bcrypt'], bcrypt__rounds=12)
        
    def __init__(self, config) -> None:
        '''
        Constructor.

        Parameters:
            config - ConfigParser file with authentication settings.
        '''
        self.secret = config['AuthSettings']['Secret']

    def verify_password(self, form_password, database_password) -> bool:
        '''
        Verifies a plain text password with the hashed passord.

        Parameters:
            form_password - The plain text password from the frontend.

            database_password - The hashed value stored in the database.

        Returns:
            bool - True if verified, False otherwise.
        '''
        return self.context.verify(form_password, database_password)

    def get_hashed_password(self, plain_password) -> str:
        return self.context.hash(plain_password)

    def encode_token(self, user_id) -> str:
        '''
        Encodes a user id into a token. Used for bearer token authentication.

        Parameters:
            user_id - User id (uid) of the user to generate a token for.

        Returns:
            str - The encoded bearer token.
        '''
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1, minutes=0),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm='HS256'
        )

    def decode_token(self, token) -> int:
        '''
        Decodes a token to retrieve the user id.

        Parameters:
            token - The token to decode.

        Returns:
            int - The user id (uid) retrieved from the token.
        '''
        try:
            payload = jwt.decode(token, self.secret, algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail='Signature has expired')
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=401, detail='Invalid token')

    def auth_wrapper(self, auth: HTTPAuthorizationCredentials = Security(security)) -> int:
        '''
        Convience function to decode bearer token from HTTP request.

        Returns:
            int - User id (uid) retrieved from the bearer token sent in the HTTP request.
        '''
        return self.decode_token(auth.credentials)