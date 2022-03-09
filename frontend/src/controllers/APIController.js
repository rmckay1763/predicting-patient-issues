import axios from "../config/api";

export const CheckToken = async (token) => {
  return axios.get("api/validate", { headers: { Authorization: `Bearer ${token}` } });
}

export const CheckAdminToken = async (token) => {
  return axios.get("api/validateAdmin", { headers: { Authorization: `Bearer ${token}` } });
}

export const Login = async (username, password) => {
  return axios.post("api/login", { username: username, password: password });
}

export const VerifyPassword = async (token, password) => {
  return axios.post("api/user/verifyPassword", password, { headers: { Authorization: `Bearer ${token}` } });
}

export const ChangePassword = async (token, update) => {
  return axios.put("api/user/updatePassword", update, { headers: { Authorization: `Bearer ${token}` }});
}

export const GetUsers = async (token) => {
  return axios.get("api/user/fetchAllUsers", { headers: { Authorization: `Bearer ${token}` } });
}

export const AddUser = async (token, userInfo) => {
  return axios.post("api/user/addUser", userInfo, { headers: { Authorization: `Bearer ${token}`}});
}

export const DeleteUser = async (token, uid) => {
  return axios.delete(`api/user/deleteUser/${uid}`, { headers: { Authorization: `Bearer ${token}`}});
}

export const GetAllPatients = async (token) => {
  return axios.get("api/patient/fetchAllPatients", { headers: { Authorization: `Bearer ${token}` } });
}

export const AddPatient = async (token, patient) => {
  return axios.post("api/patient/addPatient", patient, { headers: { Authorization: `Bearer ${token}` } });
}

export const UpdatePatient = async (token, patient) => {
  return axios.put("api/patient/updatePatient", patient, { headers: { Authorization: `Bearer ${token}` } });
}

export const DeletePatient = async (token, pid) => {
  let path = "api/patient/deletePatient/" + pid;
  return axios.delete(path, { headers: { Authorization: `Bearer ${token}` } })
}

export const GetAllVitals = async (token) => {
  return axios.get("api/patient/fetchAllVitals", { headers: { Authorization: `Bearer ${token}` } });
}

export const AddVital = async (token, vital) => {
  return axios.post("api/patient/addVital", vital, { headers: { Authorization: `Bearer ${token}` } });
}