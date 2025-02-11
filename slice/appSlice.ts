import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  isLoading: boolean;
  imgURL: string;
  isModal: boolean;
}

const initialState: CounterState = {
  isLoading: false,
  imgURL: "",
  isModal: false,
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
    },
    setIsModal: (state) => {
      state.isModal = !state.isModal;
    },
  },
});

export const { setIsLoading,setImgURL,setIsModal } = appSlice.actions;

export default appSlice.reducer;
