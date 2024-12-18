import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../theme/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigators/types';
import { AppContext } from '../../../contexts/AppContext';
import { ApiContext } from '../../../contexts/ApiContext';
import { CustomInput, Loader, WrapperContainer } from '../../../components';
import { IDelivery } from '../types/types';
import { Header } from '../components';
import { getRequest } from '../service/apiService';

const windowWidth = Dimensions.get('window').width;

const DeliveryList = () => {
    const naviation = useNavigation<NavigationProp<RootStackParamList>>();

    const { currentUser } = useContext(AppContext);

    const { apiUrl } = useContext(ApiContext);

    const [filterValue, setFilterValue] = useState<String>('');

    const [deliveryList, setDeliveryList] = useState<IDelivery[]>([]);

    const [tempDeliveryList, setTempDeliveryList] = useState<IDelivery[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loadDeliveryList = async () => {
        setIsLoading(true);

        try {
            const url = `${apiUrl?.url}/GetDeliveryNote1?ClId=${currentUser?.CLID}&AuthCode=${currentUser?.OTP}&databaseKey=${apiUrl?.databaseKey}`;
            const response = await getRequest(url);
            if (response && response.GetDeliveryNote1js.Table.length > 0) {
                setDeliveryList(response.GetDeliveryNote1js.Table);
                setTempDeliveryList(response.GetDeliveryNote1js.Table);
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(!filterValue) {
            setDeliveryList(tempDeliveryList);
        } else {
            const filteredData = deliveryList.filter(
                item =>
                    item?.Vcode?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    item?.Vname?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    item?.Mobile?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    item?.phone?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    item?.RouteName?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    item?.Address?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    item?.Balance?.toString().includes(filterValue.toString())
            );
            setDeliveryList(filteredData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterValue]);

    useEffect(() => {
        if(currentUser && Object.values(currentUser).length > 0) {
            loadDeliveryList();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);
    return (
        <GestureHandlerRootView>
            <SafeAreaView>
                <WrapperContainer>
                    <Header />
                    <View style={styles.searchContainer}>
                        <CustomInput
                            title="Search"
                            value={filterValue.toString()}
                            placeholder="Enter to search..."
                            handleChangeText={(e) => setFilterValue(e)}
                            type="default"
                            disabled={false}
                        />
                    </View>
                    <View>
                        <Text style={styles.topic}>List Of Deliviers</Text>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {deliveryList && deliveryList.map((delivery, index) => (
                            <View
                                style={styles.card}
                                key={index}
                            >
                                <View>
                                    <Text style={styles.size}><Text style={styles.count}>{delivery.Vname} - {delivery.Vcode}</Text></Text>
                                </View>
                                <View style={styles.content}>
                                    <Text style={styles.address}>{delivery.Address}</Text>
                                    <Text style={styles.size}><Text style={styles.count}>{delivery.Balance}</Text></Text>
                                    <Text style={styles.size}><Text style={styles.count}>{delivery.Mobile}, {delivery.phone}</Text></Text>
                                </View>
                                <View style={styles.linkCOntainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            naviation.navigate('Delivery', {
                                                vid: delivery.Vid,
                                            });
                                        }}
                                    >
                                        <Text style={styles.link}>Delivery Form</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            naviation.navigate('Recipt', {
                                                vid: delivery.Vid,
                                            });
                                        }}
                                    >
                                        <Text style={styles.link}>Receipt Form</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    {isLoading && <Loader isLoading={isLoading} setIsLoading={setIsLoading} />}
                </WrapperContainer>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default DeliveryList;

const styles = StyleSheet.create({
    searchContainer: {
        width: '100%',
    },
    topic: {
        color: COLORS.primaryWhiteHex,
        fontSize: 20,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginTop: 20,
        fontFamily: 'Poppins-Light',
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
    imageContainer: {
        width: 75,
        height: 75,
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 75 / 2,
    },
    size: {
        fontSize: 14,
        color: COLORS.primaryOrangeHex,
        letterSpacing: 1,
        lineHeight: 30,
        fontFamily: 'Poppins-Light',
    },
    address: {
        fontSize: 12,
        color: COLORS.primaryWhiteHex,
        fontWeight: '600',
        letterSpacing: 1,
        lineHeight: 20,
        fontFamily: 'Poppins-Light',
    },
    count: {
        fontSize: 16,
        color: COLORS.primaryWhiteHex,
        fontWeight: '500',
        letterSpacing: 1,
        fontFamily: 'Poppins-Light',
    },
    content: {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    link: {
        color: COLORS.primaryOrangeHex,
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Poppins-Medium',
    },
    linkCOntainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 1,
        marginTop: 10,
    },
});
