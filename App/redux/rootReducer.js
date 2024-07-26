import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import themeSlice from './slices/themeSlice';
import horsesSlice from './slices/horseSlice';
import breedsSlice from './slices/breedSlice';
import activitySlice from './slices/activitySlice';
import activityTypesSlice from './slices/activityTypeSlice';

// Definir la acción de deslogueo
export const logout = () => ({ type: 'LOGOUT' });

const appReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  horses: horsesSlice,
  breeds: breedsSlice,
  activities: activitySlice,
  activityTypes: activityTypesSlice,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;