/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../theme/theme';
import { AppContext } from '../../../store/AppContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigators/types';

const Splash = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { currentUser } = useContext(AppContext);

    useEffect(() => {
        if(currentUser && currentUser.username === 'revamp') {
            navigation.navigate('Settings');
        } else if(currentUser && currentUser.username !== 'revamp') {
            navigation.navigate('MainTabs');
        } else {
            const timeOut = setTimeout(() => {
                clearTimeout(timeOut);
                navigation.navigate('Login');
            }, 2000);
        }
    }, [currentUser]);

    return (
        <SafeAreaView
            style={styles.container}
        >
            <Text style={styles.title}>Gas <Text style={styles.subTitle}>Delivery</Text></Text>
        </SafeAreaView>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: COLORS.primaryBlackHex,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: COLORS.primaryWhiteHex,
        fontSize: 40,
        fontWeight: 'bold',
    },
    subTitle: {
        color: COLORS.primaryOrangeHex,
    },
});
