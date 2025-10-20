import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "@/core/api/axiosConfiq";

const initialState = {
  fertilizers: [],
  loading: false,
  error: null,
};

// Fetch all fertilizers
export const fetchFertilizers = createAsyncThunk(
  "fertilizers/fetchFertilizers",
  async (_, thunkAPI) => {
    try {
      const response = await axiosApi.get("/fertilizers");
      return response.data.data.fertilizers;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch fertilizers"
      );
    }
  }
);

// Create fertilizer
export const createFertilizer = createAsyncThunk(
  "fertilizers/createFertilizer",
  async (data, thunkAPI) => {
    try {
      const response = await axiosApi.post("/fertilizers", data);
      console.log(response);
      return response.data.data.fertilizer;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create fertilizer"
      );
    }
  }
);

// Update fertilizer
export const updateFertilizer = createAsyncThunk(
  "fertilizers/updateFertilizer",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosApi.put(`/fertilizers/${id}`, data);
      return response.data.data.fertilizer;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update fertilizer"
      );
    }
  }
);

// Delete fertilizer
export const deleteFertilizer = createAsyncThunk(
  "fertilizers/deleteFertilizer",
  async (id, thunkAPI) => {
    try {
      await axiosApi.delete(`/fertilizers/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete fertilizer"
      );
    }
  }
);

const fertilizerSlice = createSlice({
  name: "fertilizers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFertilizers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFertilizers.fulfilled, (state, action) => {
        state.loading = false;
        state.fertilizers = action.payload || [];
      })
      .addCase(fetchFertilizers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createFertilizer.fulfilled, (state, action) => {
        state.fertilizers.push(action.payload);
      })
      .addCase(updateFertilizer.fulfilled, (state, action) => {
        const index = state.fertilizers.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) state.fertilizers[index] = action.payload;
      })
      .addCase(deleteFertilizer.fulfilled, (state, action) => {
        state.fertilizers = state.fertilizers.filter(
          (f) => f._id !== action.payload
        );
      });
  },
});

export default fertilizerSlice.reducer;
