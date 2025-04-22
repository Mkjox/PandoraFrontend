import { AppDispatch } from "../redux/store";
import api from "./api";
import { Category, CategoryPayload } from "../types/category.types";
import {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    addCategory
} from '../redux/store/slices/categorySlice';
import AuthService from "./AuthService";

api.interceptors.request.use(async (config) => {
    const token = await AuthService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createCategory = (data: CategoryPayload) => async (dispatch: AppDispatch) => {
    try {
        const response = await api.post<Category>('/categories', data);
        dispatch(addCategory(response.data));
    }
    catch (error: any) {
        console.error('Failed to create category:', error.response?.data?.message || error.message);
    }
};

export const getCategoriesByUser = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(fetchCategoriesStart());
        const response = await api.get<Category[]>('/categories');
        dispatch(fetchCategoriesSuccess(response.data));
    }
    catch (error: any) {
        dispatch(fetchCategoriesFailure(error.response?.data?.message || "Failed to fetch categories"));
    }
};

export const updateCategory = (id: string, data: Partial<CategoryPayload>) => async (dispatch: AppDispatch) => {
    try {
        const response = await api.put<Category>(`/categories/${id}`, data);

    }
    catch (error: any) {
        console.error('Failed to update category:', error.response?.data?.message || error.message);
    }
};

export const deleteCategory = (id: string) => async (dispatch: AppDispatch) => {
    try {
        await api.delete(`/categories/${id}`);
        dispatch(getCategoriesByUser());
    }
    catch (error: any) {
        console.error('Failed to delete category:', error.response?.data?.message || error.message);
    }
};