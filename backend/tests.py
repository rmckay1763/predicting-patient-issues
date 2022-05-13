from fastapi.testclient import TestClient
from api.driver import APIDriver
from unittest import TestCase, main

app = APIDriver.getInstance()
client = TestClient(app)

class TestAPI(TestCase):
    '''
    Integrated tests for backend api routes.
    '''

    token = None

    @classmethod
    def setUpClass(cls):
        '''
        Logs in gets a token to test authenticated routes with.
        '''
        app = APIDriver.getInstance()
        cls.client = TestClient(app)
        response = cls.client.post(
            url='/api/login/',
            json={'username': 'admin', 'password': 'pass123'}
        )
        assert response.status_code == 200
        cls.token = response.json()['token']

    def test_bad_login(self):
        '''
        Tests log in with a bad password.
        '''
        response = self.client.post(
            url='/api/login/',
            json={'username': 'admin', 'password': 'pass1234'}
        )
        self.assertEqual(response.status_code, 401)

    def test_fetch_all_patients(self):
        '''
        Tests fetch all patients route.
        '''
        response = self.client.get(
            url='/api/patient/fetchAllPatients/',
            headers={'Authorization': 'Bearer ' + self.__class__.token}
        )
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.json()), 0)

    def test_fetch_vitals(self):
        '''
        Tests fetch 5 vitals for patient with pid 1.
        '''
        response = self.client.get(
            url='/api/patient/fetchVitals/',
            headers={'Authorization': 'Bearer ' + self.__class__.token},
            params={'key': 1, 'limit': 5}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 5)

if __name__ == '__main__':
    main()