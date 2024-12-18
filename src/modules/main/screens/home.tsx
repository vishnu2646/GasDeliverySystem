import React, { useCallback, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../theme/theme';
import { Header } from '../components';
import { Loader, WrapperContainer } from '../../../components';
import { AppContext } from '../../../contexts/AppContext';
import { ApiContext } from '../../../contexts/ApiContext';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigators/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchStocks } from '../../../redux/reducers/stocks';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;

const Home = () => {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { currentUser } = useContext(AppContext);

    const { apiUrl } = useContext(ApiContext);

    const dispatch = useAppDispatch();

    const { loading, data, error } = useAppSelector(state => state.stocks);

    const renderTotals = () => {
        const totals = data && data.GetDeliveryPortaljs && data.GetDeliveryPortaljs.Table3[0];
        return (
            <>
                <Text style={styles.size}>Cash: <Text style={styles.count}>{totals?.Cash}</Text></Text>
                <Text style={styles.size}>Others: <Text style={styles.count}>{totals?.Others}</Text></Text>
                <Text style={styles.size}>Total: <Text style={styles.count}>{totals?.Total}</Text></Text>
            </>
        );
    };

    const onRefresh = useCallback(() => {
        if(apiUrl && currentUser) {
            dispatch(fetchStocks({ apiUrl: apiUrl, currentUser }));
        }
    }, [apiUrl, currentUser, dispatch]);

    useEffect(() => {
        if(currentUser && apiUrl) {
            dispatch(fetchStocks({ apiUrl: apiUrl, currentUser }));
        }
    }, [dispatch, currentUser, apiUrl]);

    useFocusEffect(
        useCallback(() => {
            if(!currentUser) {
                navigation.navigate('Login');
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    if(loading) {
        return <Loader isLoading={loading} />;
    }

    if(error) {
        return (
            <View>
                <Text style={styles.errorTemplate}>Failed to Load Data.</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaView>
                <WrapperContainer>
                    <Header />
                    <View style={styles.priceContainer}>
                        {renderTotals()}
                    </View>
                    <View>
                        <Text style={styles.topic}>Stocks in Vehicle</Text>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                        }
                    >
                        {data && data.GetDeliveryPortaljs && data.GetDeliveryPortaljs.Table.map((stock: any, index: number) => (
                            <View style={styles.card} key={index}>
                                <View style={styles.cardHead}>
                                    <View style={styles.imageContainer}>
                                        <Text style={styles.cylindarSize}>{stock.ItemNo}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.size}>Stock in vehicle<Text style={styles.count}> {stock.StkInVhl}</Text></Text>
                                    </View>
                                </View>
                                <View style={styles.content}>
                                    <Text style={styles.size}>Opening: <Text style={styles.count}>{stock.Opening}</Text></Text>
                                    <Text style={styles.size}>Despatch: <Text style={styles.count}>{stock.Despatch}</Text></Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </WrapperContainer>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default Home;

const styles = StyleSheet.create({
    topic: {
        color: COLORS.primaryWhiteHex,
        fontSize: 20,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginTop: 20,
    },
    card: {
        width: windowWidth - 35,
        height: 'auto',
        padding: 20,
        borderWidth: 2,
        borderColor: COLORS.secondaryGreyHex,
        borderRadius: 10,
        marginTop: 20,
        marginRight: 20,
    },
    cardHead:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        width: '100%',
        marginBottom: 10,
    },
    imageContainer: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.primaryWhiteHex,
        borderRadius: 50,
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
    },
    cylindarSize: {
        fontSize: 20,
        color: COLORS.primaryOrangeHex,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    priceContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 0,
        gap: 10,
        flexWrap: 'wrap',
    },
    size: {
        fontSize: 16,
        color: COLORS.primaryWhiteHex,
        fontWeight: 'bold',
        letterSpacing: 1,
        lineHeight: 20,
        fontFamily: 'Poppins-Medium',
    },
    count: {
        fontSize: 16,
        color: COLORS.primaryOrangeHex,
        letterSpacing: 1,
        fontFamily: 'Poppins-Light',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    errorTemplate: {
        color: COLORS.primaryWhiteHex,
    },
});
