import axios from "../config/api";

export const CheckToken = async (token) => {
  return axios.get("api/validate/", { headers: { Authorization: `Bearer ${token}` } });
}

export const CheckAdminToken = async (token) => {
  return axios.get("api/validateAdmin/", { headers: { Authorization: `Bearer ${token}` } });
}

export const Login = async (username, password) => {
  return axios.post("api/login/", { username: username, password: password });
};

export const ChangePassword = async (token, uid, old_password, new_password) => {
  return axios.put("api/login/update", {uid: uid, old_password: old_password, new_password: new_password}, { headers: { Authorization: `Bearer ${token}` }});
}

export const GetUsers = async (token) => {
  return axios.get("api/user/fetchAll", { headers: { Authorization: `Bearer ${token}` } });
}

export const AddUser = async (token, firstname, lastname, username, rank, role, admin) => {
  return axios.post("api/user/insert/", { firstname: firstname, lastname: lastname, username: username, rank: rank, role: role, admin: admin}, { headers: { Authorization: `Bearer ${token}`}});
}

export const DeleteUser = async (token, uid) => {
  return axios.delete(`api/user/delete/${uid}`, { headers: { Authorization: `Bearer ${token}`}});
}

export const AddLogin = async (token, uid, password) => {
  return axios.post("api/login/insert/", { uid: uid, password: password }, { headers: { Authorization: `Bearer ${token}`}});
}

export const GetAllPatients = async (token) => {
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

export const AddVital = async (token, vital) => {
  return axios.post("api/vital/insert", vital, { headers: { Authorization: `Bearer ${token}` } });
}