import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { COLORS } from '../theme/theme';

type Props = {
    isLoading: boolean,
    setIsLoading?: (value: boolean) => any,
};

const Loader = (props: Props) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={props.isLoading}
            onRequestClose={() => props.isLoading}
        >
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color={COLORS.primaryOrangeHex} />
            </View>
        </Modal>
    );
};

export default Loader;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
