import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  image_profile: null,
  name: "",
  email: ""
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setuser: (state, action) => {
      state.token = action.payload.token || state.token;
      state.image_profile = action.payload.image_profile || state.image_profile;
    }
  },
});

export const { setuser } = userSlice.actions;
export const selectuser = (state) => state.user;
export default userSlice.reducer