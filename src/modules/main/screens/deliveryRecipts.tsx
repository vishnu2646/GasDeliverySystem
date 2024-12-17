import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loader, WrapperContainer } from '../../../components';
import { COLORS } from '../../../theme/theme';
import { getRequest } from '../service/apiService';
import { ApiContext } from '../../../store/ApiContext';
import { AppContext } from '../../../store/AppContext';
import Tabs from '../components/tabs';

const DeliveryRecipts = () => {
    const { apiUrl } = useContext(ApiContext);

    const { currentUser } = useContext(AppContext);

    const [deliveryList, setDeliveryList] = useState<any[]>([]);

    const [reciptList, setReciptList] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const loadDeliveryReciptsLists = async () => {
        setIsLoading(true);
        const url = `${apiUrl.url}/GetDeliveryandRecieptlist?ClId=${currentUser.CLID}&databaseKey=${apiUrl.databaseKey}`;
        const deliveryData = await getRequest(url);
        setDeliveryList(deliveryData.GetDeliveryandRecieptlistjs.Table);
        setReciptList(deliveryData.GetDeliveryandRecieptlistjs.Table1);
        setIsLoading(false);
    };

    const updateDeliveryList = (updatedList: any[]) => {
        setDeliveryList(updatedList);
    };

    const updateReciptList = (updatedList: any[]) => {
        setReciptList(updatedList);
    };

    useEffect(() => {
        loadDeliveryReciptsLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <SafeAreaView>
            <WrapperContainer>
                <View>
                    <Text style={styles.title}>{currentUser.Comname}</Text>
                </View>
                <View>
                    <Text style={styles.headerTitle}>Delivery / Receipts List</Text>
                </View>
                <Tabs
                    deliveryList={deliveryList}
                    reciptList={reciptList}
                    updateDeliveryList={updateDeliveryList}
                    updateReciptList={updateReciptList}
                />
                {isLoading && <Loader isLoading={isLoading} setIsLoading={setIsLoading} />}
            </WrapperContainer>
        </SafeAreaView>
    );
};

export default DeliveryRecipts;

const styles = StyleSheet.create({
    title: {
        color: COLORS.primaryWhiteHex,
        fontSize: 35,
        textAlign: 'center',
        fontWeight: '600',
        marginVertical: 20,
        fontFamily: 'Poppins-Medium',
    },
    headerTitle: {
        color: COLORS.primaryWhiteHex,
        fontSize: 16,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});
