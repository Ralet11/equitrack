import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  horses: [],
  horsesForUpdate: [],
  update: false,
  // stats
};

export const horsesSlice = createSlice({
  name: 'horses',
  initialState,
  reducers: {
    setHorses: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.horses = [...state.horses, ...action.payload];
      } else {
        state.horses = [...state.horses, action.payload];
      }
    },
    setHorsesForUpdate: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.horsesForUpdate = [...state.horsesForUpdate, ...action.payload];
      } else {
        state.horsesForUpdate = [...state.horsesForUpdate, action.payload];
      }
    },
    clearHorsesForUpdate: (state, action) => {
      state.horsesForUpdate = [];
    },
    setUpdate: (state, action) => {
      state.update = action.payload;
    },
    clearHorses: (state) => {
      state.horses = [];
    },
    editHorseById: (state, action) => {
      const { id, updatedHorse } = action.payload;
      const index = state.horses.findIndex(horse => horse.id === id);
      if (index !== -1) {
        state.horses[index] = { ...state.horses[index], ...updatedHorse };
      }
    },
    deleteHorseById: (state, action) => {
   
      const id = action.payload;
      state.horses = state.horses.filter(horse => horse.id !== id);
    }
  },
});

export const { setHorses, setHorsesForUpdate, setUpdate, clearHorses, clearHorsesForUpdate, editHorseById, deleteHorseById } = horsesSlice.actions;
export default horsesSlice.reducer;