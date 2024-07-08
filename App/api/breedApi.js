import Axios from 'react-native-axios';
import { API_URL } from '@env';
import { setBreeds } from '../redux/slices/breedSlice';

export const getBreeds = async (dispatch) => {
    try {
        const response = await Axios.get(`${API_URL}/breeds/get`);

        if (response.data.status === "ok") {
            dispatch(setBreeds(response.data.breeds));
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error fetching horses:', error);
        throw error;
    }
};