import Axios from 'react-native-axios';
import { API_URL } from '@env';
import { setHorses } from '../redux/slices/horseSlice';


export const getHorsesByUser = async (user, dispatch) => {
    try {
        const response = await Axios.get(`${API_URL}/horses/getByUser`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (response.data.status === "ok") {
            if (response.data.horses.length > 0) {
                dispatch(setHorses(response.data.horses));
            }
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error al obtener los horses', error);
        return false;
    }
};

/*export const deleteHorse = async (horseId) => {
    try {
        const response = await Axios.delete(`${API_URL}/horses/${horseId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting horse:', error);
        throw error;
    }
};

export const toggleFavorite = async (horseId, token) => {
    try {
        const response = await Axios.patch(
            `${API_URL}/horses/toggleFavorite/${horseId}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
};*/