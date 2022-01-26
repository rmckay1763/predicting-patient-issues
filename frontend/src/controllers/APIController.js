import axios from "../config/api";

export const Login = (username, password) => {
  return axios.post("api/login/", { username: username, password: password });
};

export const GetAllPatients = (token) => {
  return axios.get("api/patient/fetchAll", { headers: { Authorization: `Bearer ${token}` } });
};

export const GetUserInfo = (token) => {
  return axios.get("/api/userinfo/fetchCurrent/", { headers: { Authorization: `Bearer ${token}` } });
}
