import { ServiceResult } from './../types/service.types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import {
    LoginPayload,
    DecodedToken,
    RegisterPayload,
    UserProfileResponse
} from "../types/auth.types";

const AuthService = {
    register: async (payload: RegisterPayload): Promise<ServiceResult<string>> => {
  try {
    const reg = await api.post<{
      success: boolean;
      data: any;
      message: string;
    }>("/auth/register", payload);

    if (!reg.data.success) {
      return { success: false, message: reg.data.message };
    }

    return AuthService.login({
      UsernameOrEmail: payload.Email,  // or payload.Username
      Password: payload.Password
    });
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Registration failed"
    };
  }
},

    login: async (payload: LoginPayload): Promise<ServiceResult<string>> => {
        try {
            const response = await api.post<{ token: string }>("/auth/login", payload);
            const token = response.data.token;
            await AsyncStorage.setItem("authToken", token);

            return {
                success: true,
                data: token
            };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Login failed",
            };
        }
    },

    getToken: async (): Promise<string | null> => {
        return AsyncStorage.getItem("authToken");
    },

    decodeToken: async (): Promise<DecodedToken | null> => {
        const token = await AuthService.getToken();

        if (!token) {
            console.error("No token found.");
            return null;
        }

        try {
            return jwtDecode<DecodedToken>(token);
        } catch (err) {
            console.error("Failed to decode token", err);
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
        } catch (err: any) {
            console.error("Error fetching user profile:", err);
            return {
                success: false,
                message: err.response?.data?.message || "Failed to fetch user data",
            };
        }
    },

    logout: async (): Promise<ServiceResult<null>> => {
        try {
            await AsyncStorage.removeItem("authToken");
            return {
                success: true
            };
        } catch (err) {
            console.error("Logout failed:", err);
            return {
                success: false,
                message: "Logout failed"
            };
        }
    },
};

export default AuthService;
