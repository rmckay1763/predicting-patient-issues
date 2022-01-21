import axios from "../config/api";

export const Login = (username, password) => {
  return axios.post("login/", { username: username, password: password });
};

export const GetAllPatients = (token) => {
  return axios.get("patient/fetchAll", { headers: { Authorization: `Bearer ${token}` } });
};
