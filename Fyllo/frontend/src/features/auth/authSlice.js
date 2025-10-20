import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "@/core/api/axiosConfiq";

const initialState = {
  user: null,
  loading: false,
  error: null,
};


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axiosApi.post("/auth/login", { email, password });
      return response.data.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password, role }, thunkAPI) => {
    try {
      const response = await axiosApi.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      return response.data.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axiosApi.post("/auth/logout");
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Logout failed"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosApi.get("/auth/refresh-token");
      console.log(response);
      return response.data.data.user;
    } catch (error) {
      console.log();
      return thunkAPI.rejectWithValue(null);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch current user (refresh token)
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
