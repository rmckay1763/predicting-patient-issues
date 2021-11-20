import axios from "../config/api";

export default class APIController {
  static Login = (username, password) => {
    return axios.post("login/", { username: username, password: password });
  };
}
