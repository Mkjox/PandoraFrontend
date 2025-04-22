import { getPasswordsByUser } from './../../../services/PasswordService';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PasswordItem } from "../../../types/password.types";

interface PasswordState {
  passwords: PasswordItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PasswordState = {
  passwords: [],
  loading: false,
  error: null,
};

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    fetchPasswordsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPasswordsSuccess(state, action: PayloadAction<PasswordItem[]>) {
      state.loading = false;
      state.passwords = action.payload;
    },
    fetchPasswordsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addPassword(state, action: PayloadAction<PasswordItem>) {
      state.passwords.unshift(action.payload); // newest first
    },
    updatePassword(state, action: PayloadAction<PasswordItem>) {
      const index = state.passwords.findIndex(p => p.Id === action.payload.Id);
      if (index !== -1) {
        state.passwords[index] = action.payload;
      }
    },
    deletePassword(state, action: PayloadAction<string>) {
      state.passwords = state.passwords.filter(p => p.Id !== action.payload);
    }
  },
});

export const fetchPasswordsByUser = () => async (dispatch: any) => {
  dispatch(fetchPasswordsStart());
  try {
    const response = await PasswordService.getPasswordsByUser();
    if (response.success && response.data) {
      dispatch(fetchPasswordsSuccess(response.data));
    }
    else {
      throw new Error(response.message || 'Failed to load passwords');
    }
  }
  catch (error: any) {
    dispatch(fetchPasswordsFailure(error.message));
  }
};

export const {
  fetchPasswordsStart,
  fetchPasswordsSuccess,
  fetchPasswordsFailure,
  addPassword,
  updatePassword,
  deletePassword
} = passwordSlice.actions;

export default passwordSlice.reducer;
