import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigators/types';
import { ApiContext } from '../../../contexts/ApiContext';
import { AppContext } from '../../../contexts/AppContext';
import { ICustomerData, IPayMode } from '../types/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../theme/theme';
import { Dropdown } from 'react-native-element-dropdown';
import CustomInput from '../../../components/Input';
import SettingsButton from '../components/button';
import { getRequest, postRequest } from '../service/apiService';

type ReciptScreenRouteProp = RouteProp<RootStackParamList, 'Delivery'>;

const Recipt = () => {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { apiUrl } = useContext(ApiContext);

    const { currentUser } = useContext(AppContext);

    const route = useRoute<ReciptScreenRouteProp>();

    const { vid } = route.params;

    const [customer, setCustomer] = useState<ICustomerData>();

    const [payModes, setPayModes] = useState<IPayMode[]>();

    const [balance, setBalance] = useState<number>(0);

    const [value, setValue] = useState<string>('');

    const [reciptForm, setReciptForm] = useState({
        SqlAction: 'insert',
        RecId: 0,
        DriverId: currentUser.Drid,
        SessionId: currentUser.sessionId,
        DriverName: currentUser.DrName,
        Vid: vid,
        VCode: '',
        Vname: '',
        PayMode: '',
        ReceiptAmt: '',
        RefNumber: '',
        ClId: currentUser.CLID,
        Note: '',
        AuthCode: currentUser.OTP,
    });

    const resetReciptForm = () => {
        setReciptForm({
            SqlAction: 'insert',
            RecId: 0,
            DriverId: currentUser.Drid,
            SessionId: currentUser.sessionId,
            DriverName: currentUser.DrName,
            Vid: vid,
            VCode: '',
            Vname: '',
            PayMode: '',
            ReceiptAmt: '',
            RefNumber: '',
            ClId: currentUser.CLID,
            Note: '',
            AuthCode: currentUser.OTP,
        });
    };

    const handleGetRecipt = async () => {
        try {
            const reciptsData = await getRequest(`${apiUrl.url}/GetReceiptDtls?Vid=${vid}&CLID=${currentUser.CLID}&Drid=${currentUser.Drid}&OTP=${currentUser.OTP}&databaseKey=${apiUrl.databaseKey}`);
            if(reciptsData && reciptsData.GetReceiptDtlsjs) {
                setCustomer(reciptsData.GetReceiptDtlsjs.Table[0]);
                setReciptForm({
                    ...reciptForm,
                    VCode: reciptsData.GetReceiptDtlsjs.Table[0].VCode,
                    Vname: reciptsData.GetReceiptDtlsjs.Table[0].Vname,
                });
                setBalance(reciptsData.GetReceiptDtlsjs.Table1[0].BalanceAmount);
                setPayModes(reciptsData.GetReceiptDtlsjs.Table2);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmitRecipt = async () => {
        try {
            const url = `${apiUrl.url}/SaveReceiptSlip?databaseKey=${apiUrl.databaseKey}`;
            const postResponseData = await postRequest(url, reciptForm);
            if(postResponseData && postResponseData.SaveReceiptSlipjs) {
                const RsId = postResponseData.SaveReceiptSlipjs.Table1[0].RsId;
                resetReciptForm();
                navigation.navigate('PrintRecipts', { recId: RsId, docType: 'REC' });
            }
        } catch (error) {
            console.log(error);
            resetReciptForm();
        }
    };

    useEffect(() => {
        handleGetRecipt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SafeAreaView
            style={styles.container}
        >
            <View>
                <Text style={styles.headTitle}>{customer?.Vname || 'Form'}</Text>
                <Text style={styles.headSubtitle}>Contact: {customer?.Mobile}, {customer?.Phone}</Text>
                <Text style={styles.balance}>Balance: <Text style={styles.count}>{balance.toFixed(2)}</Text></Text>
            </View>
            <Text style={styles.recipt}>Receipt Form</Text>

            <ScrollView>

                <Text style={styles.label}>Payment Mode</Text>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    data={payModes || []}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    searchPlaceholder="Search..."
                    value={value}
                    onChange={item => {
                        if(item && item.label) {
                            setValue(item.value.toString());
                            setReciptForm({...reciptForm, PayMode: item.label.toString()});
                        }
                    }}
                />

                <CustomInput
                    title="Ref No"
                    placeholder="Enter Ref No"
                    value={reciptForm.RefNumber}
                    handleChangeText={(e) => setReciptForm({...reciptForm, RefNumber: e})}
                    disabled={false}
                    type="default"
                />

                <CustomInput
                    title="Amount"
                    placeholder="Enter Amount"
                    value={reciptForm.ReceiptAmt}
                    handleChangeText={(e) => setReciptForm({...reciptForm, ReceiptAmt: e})}
                    disabled={false}
                    type="numeric"
                />

                <CustomInput
                    title="Notes"
                    placeholder="Enter Notes"
                    value={reciptForm.Note}
                    handleChangeText={(e) => setReciptForm({...reciptForm, Note: e})}
                    disabled={false}
                    type="default"
                />

                <SettingsButton
                    title="Save Recipt"
                    isLoading={false}
                    handlePress={handleSubmitRecipt}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Recipt;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: COLORS.primaryBlackHex,
        height: '100%',
    },
    headTitle: {
        color: COLORS.primaryOrangeHex,
        fontSize: 28,
        textAlign: 'center',
        lineHeight: 40,
        letterSpacing: 4,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    headSubtitle: {
        color: COLORS.primaryWhiteHex,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 40,
        fontFamily: 'Poppins-Light',
        letterSpacing: 2,
    },
    recipt: {
        fontSize: 24,
        color: COLORS.primaryWhiteHex,
        marginBottom: 20,
        fontWeight: 600,
        letterSpacing: 2,
        fontFamily: 'Poppins-Light',
    },
    balance: {
        fontSize: 24,
        color: COLORS.primaryWhiteHex,
        marginVertical: 20,
        letterSpacing: 2,
        fontFamily: 'Poppins-Light',
    },
    count: {
        color: COLORS.primaryOrangeHex,
        fontFamily: 'Poppins-Medium',
    },
    placeholderStyle: {
        fontSize: 16,
    },
    dropdown: {
        height: 64,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: COLORS.primaryWhiteHex,
        marginBottom: 10,
        letterSpacing: 1,
        fontFamily: 'Poppins-Medium',
    },
});
