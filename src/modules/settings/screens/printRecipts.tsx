import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPrint from 'react-native-print';

import { COLORS } from '../../../theme/theme';
import { ApiContext } from '../../../store/ApiContext';
import { AppContext } from '../../../store/AppContext';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigators/types';
import { IPrintResponse } from '../types/types';
import SettingsButton from '../components/button';
import { getRequest } from '../service/apiService';

type ReciptScreenRouteProp = RouteProp<RootStackParamList, 'PrintRecipts'>;

const PrintRecipts = () => {

    const route = useRoute<ReciptScreenRouteProp>();

    const { recId, docType } = route.params;

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { apiUrl } = useContext(ApiContext);

    const { currentUser } = useContext(AppContext);

    const [receipt, setRecipt] = useState<IPrintResponse>();

    const getReciptsList = async () => {
        const url = `${apiUrl.url}/GetHtmlDatalist?ClId=${currentUser?.CLID}&AuthCode=${currentUser?.OTP}&RecId=${recId}&DocType=${docType}&databaseKey=${apiUrl.databaseKey}`;
        const responseData = await getRequest(url);
        if(responseData.GetHtmlDatalistjs && responseData.GetHtmlDatalistjs.Table) {
            if(responseData.GetHtmlDatalistjs.Table[0].RptModel === 'Receipt Model') {
                setRecipt({
                    id: recId,
                    model: responseData.GetHtmlDatalistjs.Table,
                });
            } else {
                setRecipt({
                    id: responseData.GetHtmlDatalistjs.Table[0].Recid,
                    model: responseData.GetHtmlDatalistjs.Table1,
                });
            }
        }
    };

    const hangleGetPrint = async (model: any) => {
        try {
            const url = `${apiUrl.url}/PrintHtmlData?Recid=${receipt?.id}&RptModel=${model}&databaseKey=${apiUrl.databaseKey}`;
            const printResponse = await getRequest(url);
            if(printResponse.PrintHtmlData && printResponse.PrintHtmlData.Table) {
                handlePrint(printResponse.PrintHtmlData.Table[0].SrcHtml);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePrint = async (data: any) => {
        try {
            await RNPrint.print({
                html: data,
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getReciptsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <SafeAreaView
            style={styles.container}
        >
            <Text style={styles.title}>Download Documents </Text>
            <View>
                {receipt?.model?.map((mod: any, index: number)=> (
                    <View
                        key={index}
                        style={styles.buttonsList}
                    >
                        <SettingsButton
                            title={mod.RptModel}
                            handlePress={() => hangleGetPrint(mod.RptModel)}
                            isLoading={false}
                        />
                        <View />
                    </View>
                ))}
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('MainTabs')}
            >
                <Text style={styles.link}>Back to Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default PrintRecipts;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: COLORS.primaryBlackHex,
        height: '100%',
    },
    buttonsList: {
        display: 'flex',
        gap: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        color: COLORS.primaryWhiteHex,
        textAlign: 'center',
        fontWeight: '600',
        marginVertical: 20,
        fontFamily: 'Poppins-Medium',
    },
    link: {
        color: COLORS.primaryWhiteHex,
        fontSize: 18,
    },
});
