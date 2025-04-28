import { AppDispatch } from "../redux/store";
import api from "./api";
import { Category, CategoryPayload } from "../types/category.types";
import {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    addCategory
} from '../redux/store/slices/categorySlice';
import { ServiceResult } from "../types/service.types";

const CategoryService = {
    createCategory: (data: CategoryPayload) => async (dispatch: AppDispatch): Promise<ServiceResult<Category>> => {
        try {
            const response = await api.post<Category>('/categories', data);
            dispatch(addCategory(response.data));
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            console.error('Failed to create category:', error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    },

    getCategoriesByUser: () => async (dispatch: AppDispatch): Promise<ServiceResult<Category[]>> => {
        try {
            dispatch(fetchCategoriesStart());
            const response = await api.get<Category[]>('/categories');
            dispatch(fetchCategoriesSuccess(response.data));
            return {
                success: true,
                data: response.data
            }
        }
        catch (error: any) {
            dispatch(fetchCategoriesFailure(error.response?.data?.message || "Failed to fetch categories"));
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch categories"
            };
        }
    },

    updateCategory: (id: string, data: Partial<CategoryPayload>) => async (dispatch: AppDispatch): Promise<ServiceResult<Category>> => {
        try {
            const response = await api.put<Category>(`/categories/${id}`, data);

            // await dispatch(CategoryService.getCategoriesByUser() as any);

            // re-fetching the list
            dispatch<any>(CategoryService.getCategoriesByUser());

            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            console.error('Failed to update category:', error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    },

    deleteCategory: (id: string) => async (dispatch: AppDispatch): Promise<ServiceResult<null>> => {
        try {
            await api.delete(`/categories/${id}`);
            await dispatch(CategoryService.getCategoriesByUser() as any);
            return { success: true };
        }
        catch (error: any) {
            console.error('Failed to delete category:', error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    },
}

export default CategoryService;