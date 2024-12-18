import React, { useContext, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ToastManager, { Toast } from 'toastify-react-native';

import AuthButton from '../components/button';
import { COLORS } from '../../../theme/theme';
import CustomInput from '../../../components/Input';
import { IAuthFormProps } from '../types/types';
import { AppContext } from '../../../contexts/AppContext';
import { RootStackParamList } from '../../../navigators/types';
import { ApiContext } from '../../../contexts/ApiContext';
import axios from 'axios';
import { generateUUID } from '../../../utils/utils';
import { Loader } from '../../../components';

const Login = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { updateUserData, currentUser } = useContext(AppContext);

    const { apiUrl } = useContext(ApiContext);

    const sessionId = generateUUID();

    const [loginForm, setLoginForm] = useState<IAuthFormProps>({
        username: '',
        otp: '',
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if(loginForm.username === 'revamp' && loginForm.otp === 'revamp') {
            await updateUserData(loginForm);
            navigation.navigate('Settings');
        } else {
            const url = `${apiUrl.url}/CheckLogin?UserId=1&UserName=${loginForm.username}&OTP=${loginForm.otp}&SessionId=${sessionId}&IPAddress=n/a&ComId=1&AppKey=n/a&databaseKey=${apiUrl.databaseKey}`;

            setIsLoading(true);

            try {
                const response = await axios.get(url);

                if(response && response.data) {

                    const data = response.data.CheckLoginjs.Table[0];
                    data.sessionId = sessionId;

                    await updateUserData(data);

                    Toast.success('Login successful');

                    const timeout = setTimeout(() => {
                        clearTimeout(timeout);
                        navigation.navigate('MainTabs');
                    }, 4000);

                } else {
                    Toast.error('Login failed');
                }
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                Toast.error('Something Went wrong');
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (currentUser && currentUser.username === 'revamp' && currentUser.otp === 'revamp') {
                navigation.navigate('Settings');
            } else if (currentUser && currentUser.username !== 'revamp') {
                navigation.navigate('MainTabs');
            } else {
                navigation.navigate('Login');
            }
        }, [currentUser, navigation])
    );

    return (
        <SafeAreaView
            style={style.loginArea}
        >
            <ToastManager />
            <ScrollView>
                <View style={style.loginWrapper}>
                    <Text style={style.loginTitle}>Gas <Text style={style.subTitle}>Station</Text></Text>
                    <CustomInput
                        title="Username"
                        value={loginForm.username}
                        placeholder="Enter Username"
                        handleChangeText={(e: any) => setLoginForm({ ...loginForm , username: e})}
                        type="default"
                        disabled={false}
                    />
                    <CustomInput
                        title="OTP"
                        value={loginForm.otp}
                        placeholder="Enter Otp"
                        handleChangeText={(e: any) => setLoginForm({ ...loginForm , otp: e})}
                        type="default"
                        disabled={false}
                    />
                    <View style={style.emptySpace}/>
                    <AuthButton title="Login" handlePress={handleLogin} isLoading={false} />
                </View>
            </ScrollView>
            {isLoading && <Loader isLoading={isLoading} setIsLoading={setIsLoading} />}
        </SafeAreaView>
    );
};

export default Login;

const style = StyleSheet.create({
    loginArea: {
        padding: 16,
        backgroundColor: COLORS.primaryBlackHex,
        height: '100%',
        marginBottom: 20,
    },
    loginWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100%',
    },
    loginTitle: {
        fontSize: 40,
        color: COLORS.primaryWhiteHex,
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginVertical: 10,
    },
    subTitle: {
        color: COLORS.primaryOrangeHex,
    },
    emptySpace: {
        marginVertical: 10,
    },
});
