import { getCategoriesByUser } from './../../../services/CategoryService';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../../types/category.types";

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        fetchCategoriesStart(state) {
            state.loading = true;
            state.error = null
        },
        fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
            state.loading = false;
            state.categories = action.payload;
        },
        fetchCategoriesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addCategory(state, action: PayloadAction<Category>) {
            state.categories.unshift(action.payload);
        },
    },
});

export const fetchCategoriesByUser = () => async (dispatch: any) => {
    dispatch(fetchCategoriesStart());
    try {
        const response = await CategoryService.getCategoriesByUser();
        if (response.success && response.data) {
            dispatch(fetchCategoriesSuccess(response.data));
        }
        else {
            throw new Error(response.message || 'Failed to load categories');
        }
    }
    catch (error: any) {
        dispatch(fetchCategoriesFailure(error.message));
    }
}

export const {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    addCategory
} = categorySlice.actions;

export default categorySlice.reducer;