import axios from "../config/api";

export const Login = (username, password) => {
  return axios.post("api/login/", { username: username, password: password });
};

export const GetAllPatients = (token) => {
  return axios.get("api/patient/fetchAll", { headers: { Authorization: `Bearer ${token}` } });
};

/**
 * Get all vital records from the database.
 * @param {*} token Bearer token for authentication
 * @returns Promise with JSON array of vitals
 */
 export const GetAllVitals = async (token) => {
  return axios.get("api/vital/fetchAll", { headers: { Authorization: `Bearer ${token}` } });
}

