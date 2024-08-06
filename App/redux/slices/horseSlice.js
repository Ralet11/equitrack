import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
  horses: [],
  horsesForUpdate: [],
  update: false,
  deleteNotesId: []
};

export const horsesSlice = createSlice({
  name: 'horses',
  initialState,
  reducers: {
    setHorses: (state, action) => {
      if (Array.isArray(action.payload)) {
        const horsesWithSerializedDates = action.payload.map(horse => ({
          ...horse,
          birthdate: moment(horse.birthdate).toISOString()
        }));
        state.horses = horsesWithSerializedDates;
      } else {
        const maxId = state.horses.reduce((max, horse) => Math.max(horse.id, max), 0);
        const newHorse = { 
          ...action.payload, 
          id: maxId + 1,
          birthdate: moment(action.payload.birthdate).toISOString()
        };
        state.horses = [...state.horses, newHorse];
      }
    },
    setHorsesForUpdate: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.horsesForUpdate = action.payload;
      } else {
        const newHorse = {
          ...action.payload,
          birthdate: moment(action.payload.birthdate).toISOString()
        };
        state.horsesForUpdate = [...state.horsesForUpdate, newHorse];
      }
    },
    clearHorsesForUpdate: (state) => {
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
    },
    addNoteToHorse: (state, action) => {
      const { horseId, note } = action.payload;
      const horse = state.horses.find(horse => horse.id === horseId);
      if (horse) {
        const maxNoteId = horse.Notes.reduce((max, note) => Math.max(note.id, max), 0);
        const newNote = { ...note, id: maxNoteId + 1 };
        horse.Notes.push(newNote);
        state.horsesForUpdate = state.horsesForUpdate.map(h => 
          h.id === horseId ? { ...h, Notes: horse.Notes, edited: true } : h
        );
        if (!state.horsesForUpdate.some(h => h.id === horseId)) {
          state.horsesForUpdate.push({ ...horse, edited: true });
        }
      }
    },
    deleteHorseNote: (state, action) => {
      const { horseId, noteId } = action.payload;
      const horse = state.horses.find(horse => horse.id === horseId);
      if (horse) {
        horse.Notes = horse.Notes.filter(note => note.id !== noteId);
        state.deleteNotesId.push({ horse_id: horseId, note_id: noteId });
        state.horsesForUpdate = state.horsesForUpdate.map(h => 
          h.id === horseId ? { ...h, Notes: horse.Notes, edited: true } : h
        );
        if (!state.horsesForUpdate.some(h => h.id === horseId)) {
          state.horsesForUpdate.push({ ...horse, edited: true });
        }
      }
    },
    updateHorseNote: (state, action) => {
      const { horseId, updatedNote } = action.payload;
      const horse = state.horses.find(horse => horse.id === horseId);
      if (horse) {
        const noteIndex = horse.Notes.findIndex(note => note.id === updatedNote.id);
        if (noteIndex !== -1) {
          horse.Notes[noteIndex] = updatedNote;
          state.horsesForUpdate = state.horsesForUpdate.map(h => 
            h.id === horseId ? { ...h, Notes: horse.Notes, edited: true } : h
          );
          if (!state.horsesForUpdate.some(h => h.id === horseId)) {
            state.horsesForUpdate.push({ ...horse, edited: true });
          }
        }
      }
    }
  },
});

export const {
  setHorses,
  setHorsesForUpdate,
  setUpdate,
  clearHorses,
  clearHorsesForUpdate,
  editHorseById,
  deleteHorseById,
  addNoteToHorse,
  deleteHorseNote,
  updateHorseNote
} = horsesSlice.actions;

export default horsesSlice.reducer;
