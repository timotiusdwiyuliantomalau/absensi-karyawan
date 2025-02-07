import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  isLoading: boolean;
  imgURL: string;
}

const initialState: CounterState = {
  isLoading: false,
  imgURL: "",
};

const appSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    setIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    },
    setImgURL: (state, action) => {
      state.imgURL = action.payload;
    }
  },
});

export const { setIsLoading,setImgURL } = appSlice.actions;

export default appSlice.reducer;
