import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import fertilizerReducer from "../features/fertilizers/fertilizerSlice";
import availabilityReducer from "@/features/availability/availabilitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fertilizers: fertilizerReducer,
    availability: availabilityReducer, 
  },
});

export default store;
