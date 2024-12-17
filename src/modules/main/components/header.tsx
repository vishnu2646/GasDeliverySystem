import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../theme/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigators/types';
import { AppContext } from '../../../store/AppContext';

const Header = () => {
    const naviation = useNavigation<NavigationProp<RootStackParamList>>();

    const { currentUser, clearUserData } = useContext(AppContext);

    const handleLogout = async () => {
        await clearUserData();
        naviation.navigate('Login');
    };

    return (
        <>
            <View>
                <Text style={styles.title}>{currentUser.Comname}</Text>
            </View>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Delivery Now at</Text>
                    <Text style={styles.headerSubTitle}>{currentUser?.Route}</Text>
                </View>
                <TouchableOpacity
                    onPress={handleLogout}
                >
                    <Text style={styles.action}>Logout</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default Header;

const styles = StyleSheet.create({
    title: {
        color: COLORS.primaryOrangeHex,
        fontSize: 35,
        textAlign: 'center',
        marginVertical: 10,
        fontFamily: 'Poppins-SemiBold',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 20,
    },
    headerTitle: {
        color: COLORS.primaryWhiteHex,
        fontSize: 16,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontFamily: 'Poppins-Light',
    },
    headerSubTitle: {
        color: COLORS.primaryOrangeHex,
        fontSize: 26,
        letterSpacing: 2,
        fontWeight: 800,
        textTransform: 'uppercase',
        fontFamily: 'Poppins-Light',
    },
    action: {
        color: COLORS.primaryWhiteHex,
        fontSize: 20,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontFamily: 'Poppins-Light',
    },
});
