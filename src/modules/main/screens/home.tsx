import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { COLORS } from '../../../theme/theme';
import { AppContext } from '../../../store/AppContext';
import { ApiContext } from '../../../store/ApiContext';
import { IGasStocks, ITotals } from '../types/types';
import { Header } from '../components';
import { Loader, WrapperContainer } from '../../../components';

const windowWidth = Dimensions.get('window').width;

const Home = () => {

    const { currentUser } = useContext(AppContext);

    const { apiUrl } = useContext(ApiContext);

    const [stockList, setStockList] = useState<IGasStocks[]>([]);

    const [totals, setTotals] = useState<ITotals>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loadStockList = async () => {
        setIsLoading(true);

        try {
            const url = `${apiUrl?.url}/GetDeliveryPortal?ClId=${currentUser?.CLID}&AuthCode=${currentUser?.OTP}&databaseKey=${apiUrl?.databaseKey}`;
            const response = await axios.get(url);
            if(response.data && response.data.GetDeliveryPortaljs && response.data.GetDeliveryPortaljs.Table.length > 0) {
                setStockList(response.data.GetDeliveryPortaljs.Table);
                setTotals(response.data.GetDeliveryPortaljs.Table3[0]);
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(currentUser && Object.values(currentUser).length > 0) {
            loadStockList();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    return (
        <SafeAreaView>
            <WrapperContainer>
                <Header />
                <View style={styles.priceContainer}>
                    <Text style={styles.size}>Cash: <Text style={styles.count}>{totals?.Cash}</Text></Text>
                    <Text style={styles.size}>Others: <Text style={styles.count}>{totals?.Others}</Text></Text>
                    <Text style={styles.size}>Total: <Text style={styles.count}>{totals?.Total}</Text></Text>
                </View>
                <View>
                    <Text style={styles.topic}>Stocks in Vehicle</Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {stockList && stockList.map((stock, index) => (
                        <View style={styles.card} key={index}>
                            <View style={styles.cardHead}>
                                <View style={styles.imageContainer}>
                                    <Text style={styles.cylindarSize}>{stock.ItemNo}</Text>
                                </View>
                                <View>
                                    <Text style={styles.size}>Stock in vehicle<Text style={styles.count}> {stock.StkInVhl}</Text></Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.size}>Cylinder Size <Text style={styles.count}>{stock.ItemNo}</Text></Text>
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.size}>Opening: <Text style={styles.count}>{stock.Opening}</Text></Text>
                                <Text style={styles.size}>Despatch: <Text style={styles.count}>{stock.Despatch}</Text></Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                {isLoading && <Loader isLoading={isLoading} setIsLoading={setIsLoading} />}
            </WrapperContainer>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    topic: {
        color: COLORS.primaryWhiteHex,
        fontSize: 20,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginVertical: 20,
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
});
