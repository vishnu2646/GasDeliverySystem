import React from 'react';
import AppNavigator from './src/navigators/AppNavigator';
import { AppContextProvider } from './src/store/AppContext';
import { ApiContextProvider } from './src/store/ApiContext';

const App = () => {
    return (
        <AppContextProvider>
            <ApiContextProvider>
                <AppNavigator />
            </ApiContextProvider>
        </AppContextProvider>
    );
};

export default App;
