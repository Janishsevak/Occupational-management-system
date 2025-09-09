import { createSlice } from "@reduxjs/toolkit";
const localstateSlice = createSlice({
  name: "ui",
  initialState: {
    selectedData: [],
  },
  reducers: {
    setSelectedData: (state, action) => {
      state.selectedData = action.payload;
    },
    clearSelectedData: (state) => {
      state.selectedData = [];
    },
  },
});

export const { setSelectedData, clearSelectedData } = localstateSlice.actions;
export default localstateSlice.reducer;
