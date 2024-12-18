import React, { useContext, useState } from 'react';
import { CustomTab, ITabButtonType } from '../types/types';
import TabButton from './tabButton';
import { Dimensions, StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { COLORS } from '../../../theme/theme';
import { getRequest } from '../service/apiService';
import { ApiContext } from '../../../contexts/ApiContext';
import ToastManager, { Toast } from 'toastify-react-native';

const windowWidth = Dimensions.get('window').width;

type Props = {
    deliveryList: any[],
    reciptList: any[],
    updateDeliveryList: (list: any[]) => void,
    updateReciptList: (list: any[]) => void,
}

const Tabs = ({ deliveryList, reciptList, updateDeliveryList, updateReciptList }: Props) => {

    const { apiUrl } = useContext(ApiContext);

    const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.Delivery);

    const buttons: ITabButtonType[] = [
        { title: 'Delivery' },
        { title: 'Recipt' },
    ];

    const deleteList = async (id: number, type: string) => {
        if(type === 'delivery') {
            const url = `${apiUrl.url}/DeleteMobileDeliveryNote?Recid=${id}&databaseKey=${apiUrl.databaseKey}`;
            const deleteResponse = await getRequest(url);

            Toast.success(deleteResponse.DeleteMobileDeliveryNotejs.Table[0].Result);

            const updatedDeliveryList = deliveryList.filter(item => item.Recid !== id);
            updateDeliveryList(updatedDeliveryList);
        } else if(type === 'recipt') {
            const url = `${apiUrl.url}/DeleteMobileReceipt?Rsid=${id}&databaseKey=${apiUrl.databaseKey}`;
            const deleteResponse = await getRequest(url);

            Toast.success(deleteResponse.DeleteMobileReceiptjs.Table[0].Result);

            const updatedReciptList = reciptList.filter(item => item.RsId !== id);
            updateReciptList(updatedReciptList);
        }
    };

    return (
        <>
            <TabButton buttons={buttons} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            <ToastManager />
            <View>
                {selectedTab === CustomTab.Delivery && (
                    <>
                        {deliveryList.length === 0 && (
                            <View>
                                <Text style={styles.noContent}>No Delivery Lists to display</Text>
                            </View>
                        )}
                        <ScrollView
                            contentContainerStyle={styles.deliveryCardContainer}
                            showsVerticalScrollIndicator={false}
                        >
                            {deliveryList && deliveryList.map((list, index) => (
                                <View style={[styles.card, styles.deliveryCard]} key={index}>
                                    <View style={styles.cardHead}>
                                        <Text style={styles.leftText}>{list.PartNo}</Text>
                                        <Text style={styles.rightText}>{list.Entrytime}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.customer}>{list.Customer}</Text>
                                        <View style={styles.deliveryContent}>
                                            <View>
                                                <Text style={styles.size}>Empty <Text style={styles.count}>{list.EmptyQty}</Text> </Text>
                                                <Text style={styles.size}>Quantity <Text style={styles.count}>{list.Qty}</Text></Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => deleteList(list.Recid, 'delivery')}
                                            >
                                                <Text style={styles.delete}>X</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </>
                )}

                {selectedTab === CustomTab.Recipt && (
                    <>
                        {reciptList.length === 0 && (
                            <View>
                                <Text style={styles.noContent}>No Receipts Lists to display</Text>
                            </View>
                        )}
                        <FlatList
                            data={reciptList}
                            keyExtractor={(_item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={[styles.card, styles.reciptCard]}>
                                    <View style={styles.cardHead}>
                                        <Text style={styles.leftText}>{item.Customer}</Text>
                                        <Text style={styles.rightText}>{item.Entrytime}</Text>
                                    </View>
                                    <View style={styles.deliveryContent}>
                                        <View>
                                            <Text style={styles.size}>Payment Mode <Text style={styles.count}>{item.PayMode}</Text> </Text>
                                            <Text style={styles.size}>Amount <Text style={styles.count}>{item.Amount}</Text> </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => deleteList(item.RsId, 'recipt')}
                                        >
                                            <Text style={styles.delete}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    </>
                )}
            </View>
        </>
    );
};

export default Tabs;

const styles = StyleSheet.create({
    card: {
        width: windowWidth - 35,
        padding: 15,
        borderWidth: 2,
        borderColor: COLORS.secondaryGreyHex,
        borderRadius: 10,
        marginTop: 20,
        marginRight: 20,
    },
    reciptCard: {
        height: 'auto',
    },
    deliveryCard: {
        height: 'auto',
    },
    cardHead: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width: '100%',
        marginBottom: 10,
    },
    deliveryCardContainer: {
        paddingBottom: 200,
    },
    rightText: {
        color: COLORS.primaryWhiteHex,
        fontSize: 14,
        fontWeight: 'bold',
    },
    leftText: {
        color: COLORS.primaryOrangeHex,
        fontSize: 20,
        fontWeight: 600,
        fontFamily: 'Poppins-Light',
    },
    customer: {
        color: COLORS.primaryWhiteHex,
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 1,
        fontFamily: 'Poppins-Light',
    },
    size: {
        fontSize: 16,
        color: COLORS.primaryWhiteHex,
        fontWeight: '600',
        letterSpacing: 1,
        lineHeight: 30,
        fontFamily: 'Poppins-Light',
    },
    count: {
        fontSize: 16,
        color: COLORS.primaryOrangeHex,
        letterSpacing: 1,
        fontFamily: 'Poppins-Light',
    },
    deliveryContent: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 0,
        width: '100%',
        justifyContent: 'space-between',
    },
    delete: {
        fontSize: 20,
        color: COLORS.primaryOrangeHex,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontFamily: 'Poppins-Bold',
    },
    noContent: {
        color: COLORS.primaryWhiteHex,
        fontSize: 16,
        marginTop: 30,
        fontFamily: 'Poppins-Light',
    },
});
