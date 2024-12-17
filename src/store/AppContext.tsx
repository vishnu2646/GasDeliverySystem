import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppContextProviderProps = {
    children: React.ReactNode;
}

export const AppContext = createContext<any>(null);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {

    const [currentUser, setCurrentUser] = useState<String | null>(null);

    const loadUserData = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if(storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateUserData = async (userData: any) => {
        try {
            setCurrentUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.log(error);
        }
    };

    const clearUserData = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setCurrentUser('');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadUserData();
    },[]);

    return (
        <AppContext.Provider value={{ currentUser, updateUserData, clearUserData }}>
            { children }
        </AppContext.Provider>
    );
};
