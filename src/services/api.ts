import axios from "axios";
import { API_URL } from "../config/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async config => {  
  const token = await AsyncStorage.getItem("authToken");  
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;  
  return config;  
});  

export default api;