import React, { useContext, useState } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { COLORS } from '../../../theme/theme';
import { AppContext } from '../../../contexts/AppContext';
import { ApiContext } from '../../../contexts/ApiContext';
import { RootStackParamList } from '../../../navigators/types';
import CustomInput from '../../../components/Input';
import SettingsButton from '../components/button';

const Settings = () => {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { currentUser, clearUserData } = useContext(AppContext);

    const { updateApiUrl, apiUrl } = useContext(ApiContext);

    const [settingsForm, setSettingsForm] = useState({
        url: '',
        databaseKey: '',
        appKey: '',
    });

    const handleSaveSettings = async () => {
        await updateApiUrl(settingsForm);
        Alert.alert('Saved Settings');
    };

    const handleViewData = () => {
        setSettingsForm({
            url: apiUrl?.url,
            databaseKey: apiUrl?.databaseKey,
            appKey: apiUrl?.appKey,
        });
    };

    const handleLogout = async () => {
        await clearUserData();
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView
            style={styles.loginArea}
        >
            <Text style={styles.screenTitle}>App Settings</Text>

            <Text style={styles.userText}>Hello, { currentUser ? currentUser?.username : '' }</Text>
            <ScrollView>
                <CustomInput
                    title="Api Url"
                    placeholder="Enter API URL"
                    value={settingsForm.url}
                    type="default"
                    disabled={false}
                    handleChangeText={(e) => setSettingsForm({ ...settingsForm, url: e })}
                />

                <CustomInput
                    title="Database Key"
                    placeholder="Enter Database Key"
                    value={settingsForm.databaseKey}
                    type="default"
                    disabled={false}
                    handleChangeText={(e) => setSettingsForm({ ...settingsForm, databaseKey: e })}
                />

                <CustomInput
                    title="App Key"
                    placeholder="Enter App Key"
                    value={settingsForm.appKey}
                    type="default"
                    disabled={false}
                    handleChangeText={(e) => setSettingsForm({ ...settingsForm, appKey: e })}
                />

                <SettingsButton
                    title="Save"
                    handlePress={handleSaveSettings}
                    isLoading={false}
                />

                <View
                    style={styles.actionContainer}
                >
                    <TouchableOpacity
                        onPress={handleViewData}
                    >
                        <Text style={styles.logout}>View Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleLogout}
                    >
                        <Text style={styles.logout}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;

const styles = StyleSheet.create({
    loginArea: {
        padding: 16,
        backgroundColor: COLORS.primaryBlackHex,
        height: '100%',
        marginBottom: 20,
    },
    screenTitle: {
        color: COLORS.primaryWhiteHex,
        fontSize: 40,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    userText: {
        color: COLORS.primaryWhiteHex,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logout: {
        color: COLORS.primaryWhiteHex,
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
    },
    actionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
});
