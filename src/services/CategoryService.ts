import api from "./api";
import { Category, CategoryPayload } from "../types/category.types";
import { ServiceResult } from "../types/service.types";

const CategoryService = {
    createCategory: async (data: CategoryPayload): Promise<ServiceResult<Category>> => {
        try {
            const response = await api.post<Category>("/categories", data);
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to create category"
            };
        }
    },

    updateCategory: async (id: string, data: Partial<CategoryPayload>): Promise<ServiceResult<Category>> => {
        try {
            const response = await api.put(`/categories/${id}`, data);
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update category"
            };
        }
    },

    deleteCategory: async (id: string): Promise<ServiceResult<null>> => {
        try {
            await api.delete(`/categories/${id}`);
            return {
                success: true
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to delete category"
            };
        }
    },

    getCategoryById: async (id: string): Promise<ServiceResult<Category>> => {
        try {
            const response = await api.get<Category>(`/categories/${id}`);
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch category"
            };
        }
    },

    // CHECK IF THE URL IS WRONG
    getCategoriesByUser: async (): Promise<ServiceResult<Category[]>> => {
        try {
            const response = await api.get<Category[]>(`/categories/`);
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch categories",
            };
        }
    },
};

export default CategoryService;
