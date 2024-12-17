import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Login } from '../modules/auth';
import { DeliveryList, DeliveryRecipts, Home } from '../modules/main';
import { Delivery, PrintRecipts, Recipt, Settings } from '../modules/settings';
import { COLORS } from '../theme/theme';
import { RootStackParamList } from './types';
import { Splash } from '../modules/splash';
import CustomIcon from '../components/customIcon';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

const renderTabBarIcon = (iconName: string, focused: boolean, _color: any, _size: any) => {
    return (
        <CustomIcon
            name={iconName}
            size={25}
            color={focused ? COLORS.primaryOrangeHex : COLORS.secondaryLightGreyHex}
            style={styles.tabBarIcon}
        />
    );
};

const MainBottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
            }}
            initialRouteName="Home"
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused, color, size }) => renderTabBarIcon('home', focused, color, size),
                }}
            />
            <Tab.Screen
                name="Delivery List"
                component={DeliveryList}
                options={{
                    tabBarIcon: ({ focused, color, size }) => renderTabBarIcon('menu', focused, color, size),
                }}
            />
            <Tab.Screen
                name="Delivery Recipts"
                component={DeliveryRecipts}
                options={{
                    tabBarIcon: ({ focused, color, size }) => renderTabBarIcon('wallet', focused, color, size),
                }}
            />
        </Tab.Navigator>
    );
};


const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="MainTabs" component={MainBottomTab} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="Delivery" component={Delivery} />
                <Stack.Screen name="Recipt" component={Recipt} />
                <Stack.Screen name="PrintRecipts" component={PrintRecipts} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

const styles = StyleSheet.create({
    tabBar: {
        height: 62,
        backgroundColor: COLORS.secondaryDarkGreyHex,
        borderTopWidth: 0,
        elevation: 0,
        borderTopColor: 'transparent',
    },
    tabBarIcon: {
        position: 'relative',
        top: 10,
        bottom: 0,
        left: 0,
        right: 0,
    },
});
