import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: { name: string, email: string } | null;
    isLoggedIn: boolean;
    token: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
    token: null,
    refreshToken: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ name: string, email: string, token: string, refreshToken: string }>) {
            state.user = { name: action.payload.name, email: action.payload.email };
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        logout(state) {
            state.user = null;
            state.isLoggedIn = false;
            state.token = null;
            state.refreshToken = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
        refreshToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        }
    },
});

export const { login, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;