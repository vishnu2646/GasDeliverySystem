import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ApiContextProviderProps = {
    children: React.ReactNode;
}

export const ApiContext = createContext<any>(null);

export const ApiContextProvider = ({ children }: ApiContextProviderProps) => {

    const [apiUrl, setApiUrl] = useState();

    const loadApiUrl = async () => {
        try {
            const storedAPI = await AsyncStorage.getItem('api');
            if (storedAPI) {
                const parsedData = JSON.parse(storedAPI);
                setApiUrl(parsedData);
            }
        } catch (error) {
            console.error('Failed to load Api url data:', error);
        }
    };

    const updateApiUrl = async (data: any) => {
        try {
            setApiUrl(data);
            await AsyncStorage.setItem('api', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to update user data:', error);
        }
    };

    useEffect(() => {
        loadApiUrl();
    }, []);

    return (
        <ApiContext.Provider value={{ updateApiUrl, apiUrl }}>
            {children}
        </ApiContext.Provider>
    );
};
