import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IdentityItem } from "../../../types/identity.types";

interface IdentityState {
    identities: IdentityItem[];
    loading: boolean;
    error: string | null;
}

const initialState: IdentityState = {
    identities: [],
    loading: false,
    error: null,
};

const identitySlice = createSlice({
    name: 'identity',
    initialState,
    reducers: {
        fetchIdentitiesStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchIdentitiesSuccess(state, action: PayloadAction<IdentityItem[]>) {
            state.loading = false;
            state.identities = action.payload;
            state.error = null;
        },
        fetchIdentitiesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addIdentity(state, action: PayloadAction<IdentityItem>) {
            state.identities.push(action.payload);
        },
        updateIdentity(state, action: PayloadAction<IdentityItem>) {
            const idx = state.identities.findIndex((i) => i.id === action.payload.id);
            if (idx !== -1) {
                state.identities[idx] = action.payload;
            }
        },
        deleteIdentity(state, action:PayloadAction<string>) {
            state.identities = state.identities.filter((i) => i.id !== action.payload);
        },
    },
});

export const {
    fetchIdentitiesStart,
    fetchIdentitiesSuccess,
    fetchIdentitiesFailure,
    addIdentity,
    updateIdentity,
    deleteIdentity,
} = identitySlice.actions;

export default identitySlice.reducer;