import { AppDispatch } from "../redux/store";
import api from "./api";
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/category.types";
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategory,
} from "../redux/store/slices/categorySlice";
import { ServiceResult } from "../types/service.types";

const CategoryService = {
  createCategory:
    (data: CreateCategoryPayload) =>
    async (dispatch: AppDispatch): Promise<ServiceResult<Category>> => {
      try {
        const response = await api.post<Category>("/Categories", data);
        dispatch(addCategory(response.data));
        return {
          success: true,
          data: response.data,
        };
      } catch (error: any) {
        console.error(
          "Failed to create category:",
          error.response?.data || error.message
        );
        return {
          success: false,
          message: error.response?.data || error.message,
        };
      }
    },

  getCategoriesByUser:
    () =>
    async (dispatch: AppDispatch): Promise<ServiceResult<Category[]>> => {
      try {
        dispatch(fetchCategoriesStart());
        const response = await api.get<Category[]>("/Categories");
        dispatch(fetchCategoriesSuccess(response.data));
        return {
          success: true,
          data: response.data,
        };
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to fetch categories";
        dispatch(fetchCategoriesFailure(message));
        return {
          success: false,
          message,
        };
      }
    },

  updateCategory:
    (data: UpdateCategoryPayload) =>
    async (dispatch: AppDispatch): Promise<ServiceResult<Category>> => {
      try {
        const response = await api.put<Category>("/Categories", data);

        // refetch the list
        dispatch<any>(CategoryService.getCategoriesByUser());

        return {
          success: true,
          data: response.data,
        };
      } catch (error: any) {
        console.error(
          "Failed to update category:",
          error.response?.data || error.message
        );
        return {
          success: false,
          message: error.response?.data || error.message,
        };
      }
    },

  deleteCategory:
    (id: string) =>
    async (dispatch: AppDispatch): Promise<ServiceResult<null>> => {
      try {
        await api.delete(`/api/Categories/${id}`);
        await dispatch(CategoryService.getCategoriesByUser() as any);
        return { success: true };
      } catch (error: any) {
        console.error(
          "Failed to delete category:",
          error.response?.data || error.message
        );
        return {
          success: false,
          message: error.response?.data || error.message,
        };
      }
    },
};

export default CategoryService;
