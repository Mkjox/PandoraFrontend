import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice'
import passwordReducer from './slices/passwordSlice';
import vaultReducer from './slices/vaultSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        category: categoryReducer,
        passwords: passwordReducer,
        vault: vaultReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;