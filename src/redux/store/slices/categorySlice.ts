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

export const {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    addCategory
} = categorySlice.actions;

export default categorySlice.reducer;