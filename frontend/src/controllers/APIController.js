import axios from "../config/api";

export const CheckToken = async (token) => {
    let path = "api/validate";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

export const CheckAdminToken = async (token) => {
    let path = "api/validateAdmin";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

export const Login = async (username, password) => {
    let path = "api/login";
    let credentials = { username: username, password: password }
    return axios.post(path, credentials);
}

export const VerifyPassword = async (token, password) => {
    let path = "api/user/verifyPassword";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.post(path, password, { headers: headers });
}

export const ChangePassword = async (token, update) => {
    let path = "api/user/updatePassword";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.put(path, update, { headers: headers });
}

export const GetUsers = async (token) => {
    let path = "api/user/fetchAllUsers";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

export const AddUser = async (token, userInfo) => {
    let path = "api/user/addUser";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.post(path, userInfo, { headers: headers });
}

export const UpdateUser = async (token, userInfo) => {
    let path = "api/user/updateUser";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.put(path, userInfo, { headers: headers });
}

export const DeleteUser = async (token, uid) => {
    let path = "api/user/deleteUser";
    let headers = { Authorization: `Bearer ${token}` };
    let params = { key: uid }
    return axios.delete(path, { headers: headers, params: params });
}

export const GetRanks = async (token) => {
    let path = "api/user/fetchAllRanks";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

export const GetRoles = async (token) => {
    let path = "api/user/fetchAllRoles";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

export const AddRole = async (token, role) => {
    let path = "api/user/addRole";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.post(path, role, { headers: headers });
}

export const DeleteRole = async (token, id) => {
    let path = "api/user/deleteRole";
    let headers = { Authorization: `Bearer ${token}` };
    let params = { key: id }
    return axios.delete(path, {headers: headers, params: params });
}

export const GetPatients = async (token) => {
    let path = "api/patient/fetchAllPatients";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

export const AddPatient = async (token, patient) => {
    let path = "api/patient/addPatient";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.post(path, patient, { headers: headers });
}

export const UpdatePatient = async (token, patient) => {
    let path = "api/patient/updatePatient";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.put(path, patient, { headers: headers });
}

export const DeletePatient = async (token, pid) => {
    let path = "api/patient/deletePatient/";
    let headers = { Authorization: `Bearer ${token}` }
    let params = { key: pid }
    return axios.delete(path, { headers: headers, params: params });
}

export const GetVitals = async (token, pid) => {
    let path = "api/patient/fetchVitals/";
    let headers = { Authorization: `Bearer ${token}` }
    let params = { key: pid }
    return axios.get(path, { headers: headers, params: params });
}

export const AddVital = async (token, vital) => {
    let path = "api/patient/addVital";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.post(path, vital, { headers: headers });
}