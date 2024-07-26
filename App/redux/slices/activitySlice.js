import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activities: [],
  currentActivity: {},
  activitiesForUpdate: [],
  update: false,
};

export const activitySlice = createSlice({
  name: 'Activities',
  initialState,
  reducers: {
    setCurrentActivity: (state, action) => {
      state.currentActivity = action.payload;
    },
    pushCurrentActivity: (state) => {
      const activityWithTimestamp = {
        ...state.currentActivity,
        createdAt: new Date().toISOString(),
      };
      state.activities.push(activityWithTimestamp);
      state.activitiesForUpdate.push(activityWithTimestamp);
      state.update = true;
      state.currentActivity = {};
    },
    clearAll: (state) => {
      state.activities = [];
      state.currentActivity = {};
      state.activitiesForUpdate = [];
      state.update = false;
    },
    setActivityForUpdate: (state, action) => {
      state.activitiesForUpdate.push(action.payload);
    },
    setMeasurement: (state, action) => {
      if (!state.currentActivity.measurements) {
        state.currentActivity.measurements = [];
      }
      state.currentActivity.measurements.push(action.payload);
    },
  },
});

export const {
  setCurrentActivity,
  pushCurrentActivity,
  clearAll,
  setActivityForUpdate,
  setMeasurement,
} = activitySlice.actions;

export default activitySlice.reducer;
