import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

const WrapperContainer = ({children}: any) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
};

export default WrapperContainer;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: COLORS.primaryBlackHex,
        height: '100%',
    },
});
