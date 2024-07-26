import Axios from 'react-native-axios';
import { API_URL } from '@env';
import { setHorses } from '../redux/slices/horseSlice';

export const addHorseNote = async (user, dispatch, note) => {
  try {
    const response = await Axios.post(`${API_URL}/notes/add`, note, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (response.status === 201) {
      const newNote = response.data.newNote;
      const horsesResponse = await Axios.get(`${API_URL}/horses/getByUser`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (horsesResponse.status === 200) {
        dispatch(setHorses(horsesResponse.data.horses));
      }
      return newNote;
    }

    return null;
  } catch (error) {
    console.error('Error creating the note', error);
    return null;
  }
};

export const getNotesByHorseId = async (selectedHorseId, user, setNotes) => {
  try {
    const response = await Axios.get(`${API_URL}/notes/horse/${selectedHorseId}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    console.log(response.data, "esperando notes");
    setNotes(response.data);
  } catch (error) {
    console.error('Error fetching the notes', error);
    return null;
  }
};

export const deleteHorseNotes = async (noteId, user, setNotes, horse_id) => {
  console.log("eliminando");
  try {
    const response = await Axios.delete(`${API_URL}/notes/${horse_id}/${noteId}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    setNotes(response.data.notes);
  } catch (error) {
    console.error('Error deleting the note', error);
    return null;
  }
};

export const updateHorseNotes = async (user, horse_id, updatedNote, setNotes) => {
  console.log("actualizando");
  try {
    const response = await Axios.put(`${API_URL}/notes/${horse_id}/${updatedNote.id}`, updatedNote, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    setNotes(response.data.notes);
  } catch (error) {
    console.error('Error updating the note', error);
    return null;
  }
};
