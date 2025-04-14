import api from "./api";
import { Category, CategoryPayload } from "../types/category.types";

const CategoryService = {
    createCategory: async (data: CategoryPayload) => {
        try {
            const response = await api.post("/categories", data);
            return {
                success: true,
                category: response.data as Category
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to create category"
            };
        }
    },

    updateCategory: async (id: string, data: Partial<CategoryPayload>) => {
        try {
            const response = await api.put(`/categories/${id}`, data);
            return {
                success: true,
                category: response.data as Category
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update category"
            };
        }
    },

    deleteCategory: async (id: string) => {
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

    getCategoryById: async (id: string) => {
        try {
            const response = await api.get(`/categories/${id}`);
            return {
                success: true,
                category: response.data as Category
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch category"
            };
        }
    },

    getCategoriesByUser: async () => {
        return {
            success: false,
            message: "Not implemented yet."
        };
    },
};

export default CategoryService;
