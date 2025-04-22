import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersonalVaultPayload } from '../../../types/personalVault.types'

interface VaultItem extends PersonalVaultPayload {
    id: string;
}

interface VaultState {
    vaults: VaultItem[];
    loading: boolean;
    error: string | null;
}

const initialState: VaultState = {
    vaults: [],
    loading: false,
    error: null,
};

const vaultSlice = createSlice({
    name: 'vault',
    initialState,
    reducers: {
        fetchVaultsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchVaultsSuccess(state, action: PayloadAction<VaultItem[]>) {
            state.loading = false;
            state.vaults = action.payload;
        },
        fetchVaultsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addVault(state, action: PayloadAction<VaultItem>) {
            state.vaults.unshift(action.payload);
        },
        deleteVault(state, action: PayloadAction<string>) {
            state.vaults = state.vaults.filter(v => v.id !== action.payload);
        },
        updateVault(state, action: PayloadAction<VaultItem>) {
            const index = state.vaults.findIndex(v => v.id === action.payload.id);
            if (index !== -1) {
                state.vaults[index] = action.payload;
            }
        },
    },
});

export const {
    fetchVaultsStart,
    fetchVaultsSuccess,
    fetchVaultsFailure,
    addVault,
    deleteVault,
    updateVault
} = vaultSlice.actions

export default vaultSlice.reducer;