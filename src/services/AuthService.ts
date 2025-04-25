import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import {
    LoginPayload,
    AuthResponse,
    DecodedToken,
    AuthResult,
    LogoutResult,
    RegisterPayload,
    UserProfileResponse
} from "../types/auth.types";

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
                return {
                    success: true,
                    token
                };
            }

            return { success: false, message: "Invalid response from server" };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    },

    getToken: async (): Promise<string | null> => {
        return await AsyncStorage.getItem("authToken");
    },

    decodeToken: async (): Promise<DecodedToken | null> => {
        const token = await AuthService.getToken();

        if (!token) {
            console.error("No token found.");
            return null;
        }

        try {
            const decoded: DecodedToken = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.error("Failed to decode token", error);
            return null;
        }
    },

    fetchUserProfile: async (): Promise<UserProfileResponse> => {
        const decoded = await AuthService.decodeToken();
        if (!decoded?.nameid) {
            return {
                success: false,
                message: "Invalid or missing token"
            };
        }

        try {
            const response = await api.get(`/users/${decoded.nameid}`);

            return {
                success: true,
                userData: response.data
            };
        } catch (error: any) {
            console.error("Error fetching user profile:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch user data",
            };
        }
    },

    logout: async (): Promise<LogoutResult> => {
        try {
            await AsyncStorage.removeItem("authToken");
            return {
                success: true
            };
        } catch (error) {
            console.error("Logout failed:", error);
            return {
                success: false,
                message: "Logout failed"
            };
        }
    },
};

export default AuthService;
