import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import horsesSlice from './slices/horseSlice'
import breedsSlice from './slices/breedSlice'

const rootReducer = combineReducers({
  user: userSlice,
  horses: horsesSlice,
  breeds: breedsSlice,
});

export default rootReducer;