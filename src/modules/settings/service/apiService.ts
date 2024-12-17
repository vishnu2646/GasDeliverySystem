import axios from 'axios';

export const getRequest = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postRequest = async (url: string, data: any) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
