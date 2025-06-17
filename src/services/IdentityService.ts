import { AppDispatch } from "../redux/store";
import api from "./api";
import { ServiceResult } from "../types/service.types";
import {
    fetchIdentitiesStart,
    fetchIdentitiesSuccess,
    fetchIdentitiesFailure,
    addIdentity,
    updateIdentity as updateIdentityAction,
    deleteIdentity as deleteIdentityAction,
} from '../redux/store/slices/identitySlice';
import { IdentityItem, IdentityPayload, IdentityUpdatePayload } from "../types/identity.types";
import AuthService from "./AuthService";

const IdentityService = {
    getIdentitiesByUser: () => async (dispatch: AppDispatch): Promise<ServiceResult<IdentityItem[]>> => {
        try {
            dispatch(fetchIdentitiesStart());
            const response = await api.get<IdentityItem[]>("/identities");
            dispatch(fetchIdentitiesSuccess(response.data));
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            const msg = error.response?.data?.message || "Failed to fetch identities";
            dispatch(fetchIdentitiesFailure(msg));
            return {
                success: false,
                message: msg
            };
        }
    },

    getIdentityById: async (id: string): Promise<ServiceResult<IdentityItem>> => {
        try {
            const response = await api.get<IdentityItem>(`/identities/${id}`);
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            const msg = error.response?.data?.message || "Failed to fetch identity";
            console.error("Failed to fetch identity:", error);
            return {
                success: false,
                message: msg
            };
        }
    },

    createIdentity: (payload: IdentityPayload) => async (dispatch: AppDispatch): Promise<ServiceResult<IdentityItem>> => {
        try {
            const response = await api.post<IdentityItem>("/identities", payload);
            dispatch(addIdentity(response.data));
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            const msg = error.response?.data?.message || "Failed to create identity";
            console.error(msg, error);
            return {
                success: false,
                message: msg
            };
        }
    },

    updateIdentity: (id: string, payload: IdentityUpdatePayload) => async (dispatch: AppDispatch): Promise<ServiceResult<IdentityItem>> => {
        try {
            const response = await api.put<IdentityItem>(`/identities/${id}`, payload);
            dispatch(updateIdentityAction(response.data));
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            const msg = error.response?.data?.message || "Failed to update identity";
            console.error(msg, error);
            return {
                success: false,
                message: msg
            };
        }
    },

    deleteIdentity: (id: string) => async (dispatch: AppDispatch): Promise<ServiceResult<null>> => {
        try {
            await api.delete(`/identities/${id}`);
            dispatch(deleteIdentityAction(id));
            return {
                success: true
            };
        }
        catch (error: any) {
            const msg = error.response?.data?.message || "Failed to delete identity";
            console.error(msg, error);
            return {
                success: false,
                message: msg
            };
        }
    },
};

export default IdentityService;