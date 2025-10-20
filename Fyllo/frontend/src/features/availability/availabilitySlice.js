import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "@/core/api/axiosConfiq";

const initialState = {
  availability: [],
  topRequired: [],
  leastAvailable: [],
  trend: [],
  loading: false,
  error: null,
};


export const fetchAvailability = createAsyncThunk(
  "availability/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosApi.get("/availability");
      return res.data.data.availability;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const createAvailability = createAsyncThunk(
  "availability/create",
  async (data, thunkAPI) => {
    try {
      const res = await axiosApi.post("/availability", data);
      return res.data.data.availability;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const updateAvailability = createAsyncThunk(
  "availability/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosApi.put(`/availability/${id}`, data);
      return res.data.data.availability;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const deleteAvailability = createAsyncThunk(
  "availability/delete",
  async (id, thunkAPI) => {
    try {
      await axiosApi.delete(`/availability/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchTopRequired = createAsyncThunk(
  "availability/topRequired",
  async (_, thunkAPI) => {
    try {
      const res = await axiosApi.get("/availability/top-required");
      return res.data.data.top;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchLeastAvailable = createAsyncThunk(
  "availability/leastAvailable",
  async (_, thunkAPI) => {
    try {
      const res = await axiosApi.get("/availability/least-available");
      console.log(res);
      return res.data.data.top;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchFertilizerTrend = createAsyncThunk(
  "availability/trend",
  async ({ fertilizerId, year }, thunkAPI) => {
    try {
      const res = await axiosApi.get(
        `/availability/trend/${fertilizerId}?year=${year}`
      );
      return res.data.data.trend;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailability.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (s, a) => {
        s.loading = false;
        s.availability = a.payload;
      })
      .addCase(fetchAvailability.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(createAvailability.fulfilled, (s, a) => {
        s.availability.push(a.payload);
      })
      .addCase(updateAvailability.fulfilled, (s, a) => {
        const idx = s.availability.findIndex((i) => i._id === a.payload._id);
        if (idx >= 0) s.availability[idx] = a.payload;
      })
      .addCase(deleteAvailability.fulfilled, (s, a) => {
        s.availability = s.availability.filter((i) => i._id !== a.payload);
      })
      .addCase(fetchTopRequired.fulfilled, (s, a) => {
        s.topRequired = a.payload;
      })
      .addCase(fetchLeastAvailable.fulfilled, (s, a) => {
        s.leastAvailable = a.payload;
      })
      .addCase(fetchFertilizerTrend.fulfilled, (s, a) => {
        s.trend = a.payload;
      });
  },
});

export default availabilitySlice.reducer;
