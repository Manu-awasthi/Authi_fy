import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/users", 
  withCredentials: true,            
});

export default API;
