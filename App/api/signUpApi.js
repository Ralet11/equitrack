import axios from 'axios';
import { API_URL } from "@env";

export const signUp = async (userData, navigation) => {
    try {
        const data = {
            name: userData.name,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password
        };

        const response = await axios.post(`${API_URL}/auth/register`, data);

        if (response.data.status === "ok") {
            return true;
        }
    } catch (error) {
        console.log(error);
    }
};