import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activityTypes: []
};

export const activityTypesSlice = createSlice({
  name: 'activityTypes',
  initialState,
  reducers: {
    setActivityTypes: (state, action) => {
        if (Array.isArray(action.payload)) {
          state.activityTypes = [...state.activityTypes, ...action.payload];
        } else {
          state.activityTypes = [...state.activityTypes, action.payload];
        }
      },
  },
});

export const { setActivityTypes } = activityTypesSlice.actions;
export default activityTypesSlice.reducer