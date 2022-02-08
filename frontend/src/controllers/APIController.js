import axios from "../config/api";

export const Login = (username, password) => {
  return axios.post("api/login/", { username: username, password: password });
};

export const ChangePassword = (token, uid, old_password, new_password) => {
  return axios.put("api/login/update", {uid: uid, old_password: old_password, new_password: new_password}, { headers: { Authorization: `Bearer ${token}` }});
}

export const GetAllPatients = (token) => {
  return axios.get("api/patient/fetchAll", { headers: { Authorization: `Bearer ${token}` } });
};

 export const GetAllVitals = async (token) => {
  return axios.get("api/vital/fetchAll", { headers: { Authorization: `Bearer ${token}` } });
}

export const AddPatient = async (token, patient) => {
  return axios.post("api/patient/insert", patient, { headers: { Authorization: `Bearer ${token}` } });
}

export const UpdatePatient = async (token, patient) => {
  return axios.put("api/patient/update", patient, { headers: { Authorization: `Bearer ${token}` } });
}

export const DeletePatient = async (token, pid) => {
  let path = "api/patient/delete/" + pid;
  return axios.delete(path, { headers: { Authorization: `Bearer ${token}` } })
}