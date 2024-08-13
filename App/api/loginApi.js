import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from "@env";
import { getBreeds } from './breedApi';
import { getHorsesByUser } from './horseApi';
import { setuser } from '../redux/slices/userSlice';
import { getActivityTypes } from './activitiesApi';



export const loginUser = async (email, password, dispatch) => {
    const data = {
        email: email,
        pass: password,
    };

    try {

        Alert.alert(`${API_URL}/auth/login`)
        const response = await axios.post(`${API_URL}/auth/login`, data);

        if (response.data.status === "ok") {
            const userData = {
                token: response.data.token,
                image_profile: response.data.user.image_profile,
            };
            dispatch(setuser(userData));

            const resultBreeds = await getBreeds(dispatch);
            const resultActivities = await getActivityTypes(dispatch)
            const resultHorses = await getHorsesByUser(userData, dispatch);

          
            return true;
        } else {
            Alert.alert("Email o contraseña invalido");
        }

        return false;
    } catch (error) {
        Alert.alert(error)
        throw error;
    }
};