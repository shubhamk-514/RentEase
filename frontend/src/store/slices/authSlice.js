import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";
// Get user from localStorage
const storedUser = localStorage.getItem("rentease_user")
  ? JSON.parse(localStorage.getItem("rentease_user"))
  : null;
const storedToken = localStorage.getItem("rentease_token") || null;
const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
  successMsg: null,
  verificationEmail: localStorage.getItem("rentease_verify_email") || null,
};
// Async Thunks
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, thunkAPI) => {
    try {
      const response = await API.post("/auth/signup", userData);
      // Store email temporarily for OTP screen
      localStorage.setItem("rentease_verify_email", userData.email);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, thunkAPI) => {
    try {
      const response = await API.post("/auth/verify-otp", { email, otp });
      if (response.data.token) {
        localStorage.setItem("rentease_token", response.data.token);
        localStorage.setItem(
          "rentease_user",
          JSON.stringify(response.data.user),
        );
        localStorage.removeItem("rentease_verify_email");
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await API.post("/auth/login", userData);
      if (response.data.token) {
        localStorage.setItem("rentease_token", response.data.token);
        localStorage.setItem(
          "rentease_user",
          JSON.stringify(response.data.user),
        );
        localStorage.removeItem("rentease_verify_email");
      }
      return response.data;
    } catch (error) {
      // If error payload indicates not verified, return it specifically
      if (error.response?.data?.isVerified === false) {
        localStorage.setItem("rentease_verify_email", userData.email);
        return thunkAPI.rejectWithValue({
          message: error.response.data.message,
          notVerified: true,
          email: userData.email,
        });
      }
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const response = await API.post("/auth/forgot-password", { email });
      localStorage.setItem("rentease_verify_email", email); // store for password reset step
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, token, newPassword }, thunkAPI) => {
    try {
      const response = await API.post("/auth/reset-password", {
        email,
        token,
        newPassword,
      });
      localStorage.removeItem("rentease_verify_email");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const response = await API.put("/users/profile", profileData);
      localStorage.setItem("rentease_user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("rentease_token");
      localStorage.removeItem("rentease_user");
      localStorage.removeItem("rentease_verify_email");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.verificationEmail = null;
      state.error = null;
      state.successMsg = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMsg = null;
    },
    setVerifyEmail: (state, action) => {
      state.verificationEmail = action.payload;
      localStorage.setItem("rentease_verify_email", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message;
        state.verificationEmail = action.payload.email;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMsg = action.payload.message;
        state.verificationEmail = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMsg = "Logged in successfully";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // Check if role verified issue
        if (action.payload?.notVerified) {
          state.error = action.payload.message;
          state.verificationEmail = action.payload.email;
        } else {
          state.error = action.payload?.message || "Login failed";
        }
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message;
        state.verificationEmail = action.payload.email;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message;
        state.verificationEmail = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.successMsg = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { logoutUser, clearMessages, setVerifyEmail } = authSlice.actions;
export default authSlice.reducer;
