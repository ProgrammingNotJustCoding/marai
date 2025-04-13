import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8080/api",
});

export default instance;
