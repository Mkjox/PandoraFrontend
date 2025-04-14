import axios from "axios";
import AuthService from "./AuthService";
import { PersonalVaultPayload, PersonalVaultUpdatePayload } from "../types/personalVault.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use(async (config) => {
  const token = await AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all vaults for logged-in user
const getPersonalVaults = async () => {
  try {
    const response = await api.get("/vaults");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to fetch vaults" };
  }
};

// Get a specific vault by ID
const getVaultById = async (vaultId: string) => {
  try {
    const response = await api.get(`/vaults/${vaultId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to fetch vault" };
  }
};

// 📝 Create new vault
const createVault = async (payload: PersonalVaultPayload) => {
  try {
    const response = await api.post("/vaults", payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to create vault" };
  }
};

// Update vault
const updateVault = async (vaultId: string, payload: PersonalVaultUpdatePayload) => {
  try {
    const response = await api.put(`/vaults/${vaultId}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to update vault" };
  }
};

// Delete vault
const deleteVault = async (vaultId: string) => {
  try {
    await api.delete(`/vaults/${vaultId}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to delete vault" };
  }
};

export default {
  getPersonalVaults,
  getVaultById,
  createVault,
  updateVault,
  deleteVault,
};
