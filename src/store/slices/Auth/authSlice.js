import { createSlice } from '@reduxjs/toolkit';
import { login, logout, register, loginWithGoogle, getResetAccessToken, verifyCaptcha, checkAuthStatus } from './action';

const initialState = {
    user: null,
    token: localStorage.getItem('token') || '',
    isLoading: false,
    error: null,
    isAuthenticated: false,
    captchaVerified: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                console.log("Action Payload:", action.payload); // Ghi log để kiểm tra payload

                state.isLoading = false;
                if (action.payload.data.user) {
                    state.user = action.payload.data.user;  // Đảm bảo rằng action.payload.user tồn tại
                } else {
                    console.error('User not found in action payload');
                }
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
            })
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Login with Google
            .addCase(loginWithGoogle.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // Reset Access Token
            .addCase(getResetAccessToken.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getResetAccessToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken; // Assuming the response includes an accessToken field
            })
            .addCase(getResetAccessToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Verify CAPTCHA
            .addCase(verifyCaptcha.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyCaptcha.fulfilled, (state) => {
                state.isLoading = false;
                state.captchaVerified = true;
            })
            .addCase(verifyCaptcha.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.captchaVerified = false;
            })
            // check auth status
            .addCase(checkAuthStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.isAuthenticated = true;
                state.token = localStorage.getItem('token');
                console.log("action payload", state.user);
                state.isLoading = false;
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                state.isLoading = false;
            });
    },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;