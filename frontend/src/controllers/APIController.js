import axios from "../config/api";

/**
 * Check if the token stored in the browser is valid.
 * @param {*} token Token to verifity
 * @returns True if successfully verified, false otherwise.
 */
export const CheckToken = async (token) => {
    let path = "api/validate";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

/**
 * Check if the token has admin privileges.
 * @param {*} token Token to check.
 * @returns True if token has admin privileges, false otherwise.
 */
export const CheckAdminToken = async (token) => {
    let path = "api/validateAdmin";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

/**
 * Loging to the backend database.
 * @param {*} username Username to login with.
 * @param {*} password Passord to login with.
 * @returns Bearer token and JSON object representing the user.
 */
export const Login = async (username, password) => {
    let path = "api/login";
    let credentials = { username: username, password: password }
    return axios.post(path, credentials);
}

/**
 * Checks if the password belongs to the user currently logged in.
 * @param {*} token Bearer token from local storage of current user.
 * @param {*} password The candidate password to verify.
 * @returns True if successfully verified, false otherwise.
 */
export const VerifyPassword = async (token, password) => {
    let path = "api/user/verifyPassword";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.post(path, password, { headers: headers });
}

/**
 * Update the password for a user.
 * @param {*} token Bearer token from local storage, requires admin privilegs.
 * @param {*} update JSON object with updated password information.
 * @returns True if the password successfully updates, false otherwise.
 */
export const ChangePassword = async (token, update) => {
    let path = "api/user/updatePassword";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.put(path, update, { headers: headers });
}

/**
 * Fetch a list of all registered users.
 * @param {*} token Bearer token from local storage, requires admin privilegs.
 * @returns List of all users in the backend database.
 */
export const GetUsers = async (token) => {
    let path = "api/user/fetchAllUsersMinusCaller";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

/**
 * Add a new user to the application.
 * @param {*} token Bearer token from local storage, requires admin privilegs.
 * @param {*} userInfo JSON object with the new user's information.
 * @returns User id (uid) of the new user.
 */
export const AddUser = async (token, userInfo) => {
    let path = "api/user/addUser";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.post(path, userInfo, { headers: headers });
}

/**
 * Update a user's information.
 * @param {*} token Bearer token from local storage, requires admin privilegs.
 * @param {*} userInfo JSON object with the user's updated information.
 * @returns JSON object of resulting update.
 */
export const UpdateUser = async (token, userInfo) => {
    let path = "api/user/updateUser";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.put(path, userInfo, { headers: headers });
}

/**
 * Delete a user from the application.
 * @param {*} token Bearer token from local storage, requires admin privilegs.
 * @param {*} uid User id (uid) of the user to delete.
 * @returns True if successful, false otherwise.
 */
export const DeleteUser = async (token, uid) => {
    let path = "api/user/deleteUser";
    let headers = { Authorization: `Bearer ${token}` };
    let params = { key: uid }
    return axios.delete(path, { headers: headers, params: params });
}

/**
 * Fetch a list of possible user ranks from the backend database.
 * @param {*} token Bearer token from local storage, requires admin privilegs.
 * @returns List of possible ranks for a user.
 */
export const GetRanks = async (token) => {
    let path = "api/user/fetchAllRanks";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

/**
 * Fetch a list of possible user roles from the backend database.
 * @param {*} token Bearer token from local storage, requires admin privilegs.
 * @returns List of possible roles for a user.
 */
export const GetRoles = async (token) => {
    let path = "api/user/fetchAllRoles";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

/**
 * Add a user role to the backend database.
 * @param {*} token Bearer token from local storage, requires admin privilegs.
 * @param {*} role JSON object with the information for the new role.
 * @returns Primary key of the new role.
 */
export const AddRole = async (token, role) => {
    let path = "api/user/addRole";
    let headers = { Authorization: `Bearer ${token}` };
    let params = { name: role }
    return axios.post(path, params, { headers: headers });
}

/**
 * Delete a user role form the backend database.
 * @param {*} token Bearer token from local storage, requires admin privilegs.
 * @param {*} id Primary key of the user role to delete.
 * @returns True if successful, false otherwise.
 */
export const DeleteRole = async (token, id) => {
    let path = "api/user/deleteRole";
    let headers = { Authorization: `Bearer ${token}` };
    let params = { key: id }
    return axios.delete(path, {headers: headers, params: params });
}

/**
 * Fetch a list of patients stored in the backend database.
 * @param {*} token Bearer token from local storage.
 * @returns List of all patients.
 */
export const GetPatients = async (token) => {
    let path = "api/patient/fetchAllPatients";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.get(path, { headers: headers });
}

/**
 * Add a new patient to the backend database.
 * @param {*} token Bearer token from local storage.
 * @param {*} patient JSON object with the patient's information.
 * @returns Primary key of the new patient.
 */
export const AddPatient = async (token, patient) => {
    let path = "api/patient/addPatient";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.post(path, patient, { headers: headers });
}

/**
 * Update a patient's information.
 * @param {*} token Bearer token from local storage.
 * @param {*} patient JSON object with the updated information.
 * @returns JSON object with the result of the update.
 */
export const UpdatePatient = async (token, patient) => {
    let path = "api/patient/updatePatient";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.put(path, patient, { headers: headers });
}

/**
 * Delete a patient from the backend database.
 * @param {*} token Bearer token from local storage.
 * @param {*} pid Primary key of the patient to delete.
 * @returns True if successful, false otherwise.
 */
export const DeletePatient = async (token, pid) => {
    let path = "api/patient/deletePatient/";
    let headers = { Authorization: `Bearer ${token}` }
    let params = { key: pid }
    return axios.delete(path, { headers: headers, params: params });
}

/**
 * Fetch vital records for a specified patient.
 * @param {*} token Bearer token from local storage.
 * @param {*} pid Primary key of the patient to fetch records from.
 * @returns List of vital records.
 */
export const GetVitals = async (token, pid) => {
    let path = "api/patient/fetchVitals/";
    let headers = { Authorization: `Bearer ${token}` }
    let params = { key: pid }
    return axios.get(path, { headers: headers, params: params });
}

/**
 * Add a new vital record for a specified patient.
 * @param {*} token Bearer token from local storage.
 * @param {*} vital JSON object with the new vital record.
 * @returns Primary key of the new vital record.
 */
export const AddVital = async (token, vital) => {
    let path = "api/patient/addVital";
    let headers = { Authorization: `Bearer ${token}` };
    return axios.post(path, vital, { headers: headers });
}