import React from 'react';
import AppNavigator from './src/navigators/AppNavigator';
import { AppContextProvider } from './src/contexts/AppContext';
import { ApiContextProvider } from './src/contexts/ApiContext';
import { Provider } from 'react-redux';
import store from './src/redux/store';

const App = () => {
    return (
        <Provider store={store}>
            <AppContextProvider>
                <ApiContextProvider>
                    <AppNavigator />
                </ApiContextProvider>
            </AppContextProvider>
        </Provider>
    );
};

export default App;
