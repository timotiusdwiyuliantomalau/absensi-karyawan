// src/redux/slices/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  isLoading: boolean;
}

const initialState: CounterState = {
  isLoading: false,
};

const appSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    setIsLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const { setIsLoading } = appSlice.actions;

export default appSlice.reducer;
