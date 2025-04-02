import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const API_URL = "";

const login = async (UsernameOrEmail: string, Password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { UsernameOrEmail, Password });

        if (response.data.token) {
            await AsyncStorage.setItem("authToken", response.data.token);
            console.log("Logged in successfully");
            return { success: true, token: response.data.token };
        } else {
            return { success: false, message: "Invalid response from server" };
        }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Login failed" };
    }
};

const getToken = async () => {
    return await AsyncStorage.getItem("authToken");
};

const decodeToken = async () => {
    const token = await getToken();
    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token);
        return decoded;
    }
    catch (error) {
        console.error("Failed to decode token", error);
        return null;
    }
};

const fetchUserProfile = async () => {
    console.log("Fetching user profile...");

    const decoded = await decodeToken();
    if (!decoded || !decoded.nameid)
        return { success: false, message: 'Invalid token' };

    try {
        console.log(`Fetching data for user ID: ${decoded.nameid}`);
        const response = await axios.get(`${API_URL}/users/${decoded.nameid}`);
        console.log("API Response:", response.data);
        return { success: true, userData: response.data };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch user data" };
    }
};

const logout = async () => {
    try {
        await AsyncStorage.removeItem("authToken");
        console.log("Logged out successfully")
    }
    catch (error) {
        return console.log("Logout failed.")
    }
};

export default { login, getToken, decodeToken, fetchUserProfile, logout };