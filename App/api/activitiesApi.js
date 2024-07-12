import Axios from 'react-native-axios';
import { API_URL } from '@env';
import { setActivityTypes } from '../redux/slices/activityTypeSlice';

export const getActivityTypes = async (dispatch) => {
    try {
        const response = await Axios.get(`${API_URL}/activityTypes/get`);

        if (response.data.status === "ok") {
            dispatch(setActivityTypes(response.data.activities));
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
};