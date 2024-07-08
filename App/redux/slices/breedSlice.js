import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  breeds: []
};

export const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {
    setBreeds: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.breeds = [...state.breeds, ...action.payload];
      } else {
        state.breeds = [...state.breeds, action.payload];
      }
    },
  },
});

export const { setBreeds } = breedsSlice.actions;
export default breedsSlice.reducer