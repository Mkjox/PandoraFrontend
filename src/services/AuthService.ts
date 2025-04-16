import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import { LoginPayload, AuthResponse, DecodedToken, AuthResult, LogoutResult, RegisterPayload } from "../types/auth.types";

const AuthService = {
    register: async ({
        Username,
        Email,
        PhoneNumber,
        FirstName,
        LastName,
        Password,
        ConfirmPassword
    }: RegisterPayload): Promise<AuthResult> => {
        try {
            const response = await api.post("/auth/register", {
                Username,
                Email,
                PhoneNumber,
                FirstName,
                LastName,
                Password,
                ConfirmPassword
            });

            const token = response.data?.token;
            if (token) {
                await AsyncStorage.setItem("authToken", token);
                return {
                    success: true,
                    token
                };
            }

            return {
                success: false,
                message: "Invalid response from server"
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    },


    login: async ({ UsernameOrEmail, Password }: LoginPayload): Promise<AuthResult> => {
        try {
            const response = await api.post("/auth/login", { UsernameOrEmail, Password });

            const token = response.data?.token;
            if (token) {
                await AsyncStorage.setItem("authToken", token);
                return { success: true, token };
            }

            return { success: false, message: "Invalid response from server" };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    },

    getToken: async () => {
        return await AsyncStorage.getItem("authToken");
    },

    decodeToken: async () => {
        const token = await AuthService.getToken();

        if (!token) {
            console.error("No token found.");
            return null;
        }

        try {
            const decoded: any = jwtDecode(token);
            //   console.log("Decoded Token:", decoded);
            return decoded;
        } catch (error) {
            console.error("Failed to decode token", error);
            return null;
        }
    },

    fetchUserProfile: async () => {
        // console.log("Fetching user profile...");

        const decoded = await AuthService.decodeToken();
        if (!decoded?.nameid) {
            return { success: false, message: "Invalid or missing token" };
        }

        try {
            const response = await api.get(`/users/${decoded.nameid}`);
            //   console.log("User Data:", response.data);

            return { success: true, userData: response.data };
        } catch (error: any) {
            console.error("Error fetching user profile:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch user data",
            };
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem("authToken");
            console.log("Logged out successfully.");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    },
};

export default AuthService;
