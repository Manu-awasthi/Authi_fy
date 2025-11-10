import axios from "axios";

const API = axios.create({
  baseURL: "https://authi-fy.onrender.com/api/users", 
  withCredentials: true,            
});

export default API;
