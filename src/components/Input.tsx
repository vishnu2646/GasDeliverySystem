import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardType } from 'react-native';
import { COLORS } from '../theme/theme';

type IInputProps = {
    title: String,
    value: string,
    placeholder: string,
    handleChangeText?: (e: any) => void,
    type: KeyboardType,
    disabled: boolean
};

const CustomInput = (props: IInputProps) => {
    // const [showPassword, setShowPassword] = useState<boolean>(false);
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.labelText}>{props.title}</Text>
            <View style={styles.inputBox}>
                <TextInput
                    placeholder={props.placeholder}
                    value={props.value}
                    keyboardType={props.type}
                    editable={!props.disabled}
                    placeholderTextColor={COLORS.primaryLightGreyHex}
                    onChangeText={props.handleChangeText}
                    style={styles.input}
                    // secureTextEntry={props.title === 'Password' && !showPassword}
                />
            </View>
        </View>
    );
};

export default CustomInput;

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 8,
    },
    labelText: {
        fontSize: 16,
        color: COLORS.primaryWhiteHex,
        marginBottom: 10,
        fontFamily: 'Poppins-Medium',
        letterSpacing: 1,
    },
    inputBox: {
        width: '100%',
        height: 64,
        paddingHorizontal: 16,
        borderWidth: 2,
        display: 'flex',
        borderRadius: 16,
        borderColor: COLORS.secondaryGreyHex,
        marginBottom: 20,
    },
    input: {
        color: '#FFFFFF',
        height: 64,
        fontFamily: 'Poppins-Light',
    },
});
