import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ISettingsButtonProps } from '../types/types';
import { COLORS } from '../../../theme/theme';

const SettingsButton: React.FC<ISettingsButtonProps> = ({ handlePress, title, isLoading }) => {
    const buttonStyles = isLoading ? styles.loadingButton : styles.button;

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[styles.buttonStyles, buttonStyles]}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default SettingsButton;

const styles = StyleSheet.create({
    button: {
        opacity: 1,
    },

    loadingButton: {
        opacity: 0.5,
    },

    buttonStyles: {
        backgroundColor: COLORS.primaryOrangeHex,
        borderRadius: 12,
        minHeight: 62,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Poppins-Medium',
    },
});
