from fastapi.testclient import TestClient
from api.driver import APIDriver
from unittest import TestCase, main

app = APIDriver.getInstance()
client = TestClient(app)

class TestAPI(TestCase):

    token = None

    @classmethod
    def setUpClass(cls):
        app = APIDriver.getInstance()
        cls.client = TestClient(app)
        response = cls.client.post(
            url='/api/login/',
            json={'username': 'admin', 'password': 'pass123'}
        )
        assert response.status_code == 200
        cls.token = response.json()['token']

    def test_bad_login(self):
        response = self.client.post(
            url='/api/login/',
            json={'username': 'admin', 'password': 'pass1234'}
        )
        self.assertEqual(response.status_code, 401)

    def test_fetch_all_patients(self):
        response = self.client.get(
            url='/api/patient/fetchAllPatients/',
            headers={'Authorization': 'Bearer ' + self.__class__.token}
        )
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.json()), 0)

    def test_fetch_one_patient(self):
        response = self.client.get(
            url='/api/patient/fetchOnePatient/1',
            headers={'Authorization': 'Bearer ' + self.__class__.token}
        )
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    main()