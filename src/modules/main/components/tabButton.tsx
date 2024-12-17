import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ITabButtonType } from '../types/types';
import { COLORS } from '../../../theme/theme';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type ITabButtonProps = {
    buttons: ITabButtonType[],
    selectedTab: number,
    setSelectedTab: (index: number) => void,
};

const TabButton = ({ buttons, selectedTab, setSelectedTab }: ITabButtonProps) => {

    const [dimenstions, setDimensions] = useState({ height: 20, width: 100 });

    const buttonWidth = dimenstions.width / buttons.length;

    const tabPositionX = useSharedValue(0);

    const onTabBarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    };

    const handlePress = (index: number) => {
        setSelectedTab(index);
    };

    const onTabPress = (index: number) => {
        tabPositionX.value = withTiming(buttonWidth * index, {}, () => {
            runOnJS(handlePress)(index);
        });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: tabPositionX.value}],
        };
    });

    return (
        <View
            style={styles.tabContainer}
        >
            <Animated.View
                style={[
                    styles.tabWrapper,
                    animatedStyle,
                    { height: dimenstions.height - 10, width: buttonWidth - 10 },
                ]}
            />
            <View onLayout={onTabBarLayout} style={styles.tabBar}>
                {buttons.map((button, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.tabButton}
                        onPress={() => onTabPress(index)}
                    >
                        <Text
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{
                                color: selectedTab === index ? COLORS.primaryOrangeHex : COLORS.primaryWhiteHex,
                                alignSelf: 'center',
                                fontWeight: selectedTab === index ? 'bold' : 600,
                                fontSize: 14,
                                fontFamily: 'Poppins-SemiBold',
                                letterSpacing: 2,
                            }}
                        >
                            {button.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default TabButton;

const styles = StyleSheet.create({
    tabContainer: {
        backgroundColor: COLORS.primaryOrangeHex,
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 20,
    },
    tabBar: {
        flexDirection: 'row',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 20,
    },
    tabBarText: {
        color: COLORS.primaryWhiteHex,
    },
    tabWrapper: {
        position: 'absolute',
        backgroundColor: COLORS.primaryWhiteHex,
        borderRadius: 20,
        marginHorizontal: 5,
    },
});
