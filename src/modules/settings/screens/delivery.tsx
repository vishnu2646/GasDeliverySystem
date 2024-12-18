import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ApiContext } from '../../../contexts/ApiContext';
import { AppContext } from '../../../contexts/AppContext';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ICustomer, IDropDown, IStock } from '../types/types';
import CustomInput from '../../../components/Input';
import SignatureView, { SignatureViewRef } from 'react-native-signature-canvas';
import SettingsButton from '../components/button';
import { getRequest } from '../service/apiService';

type ReciptScreenRouteProp = RouteProp<RootStackParamList, 'Delivery'>;

const Delivery = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { apiUrl } = useContext(ApiContext);

    const { currentUser } = useContext(AppContext);

    const route = useRoute<ReciptScreenRouteProp>();

    const { vid } = route.params;

    const signatureRef = useRef<SignatureViewRef>(null);

    const [customer, setCustomer] = useState<ICustomer | null>(null);

    const [stockData, setStockData] = useState<IStock[]>([]);

    const [dropDown, setDropDown] = useState<IDropDown[]>([]);

    const [isSigning, setIsSigning] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        SqlAction: 'insert',
        RecId: 0,
        SessionId: currentUser?.sessionId,
        DriverName: currentUser?.DrName || '',
        DriverId: currentUser?.Drid || '',
        Vid: 0,
        VCode: '',
        Vname: '',
        balQty: 0,
        DESPQTY: '',
        EMPTYQTY: '',
        Note: '',
        Itemid: 0,
        ItemNo: '',
        ClId: currentUser?.CLID || '',
        AuthCode: currentUser?.OTP || '',
        SigfileNameOnly: '',
    });

    const handleGetDelivery = async () => {
        try {
            const url = `${apiUrl?.url}/GetReceiptVendor?Vid=${vid}&ClId=${currentUser?.CLID}&AuthCode=${currentUser?.OTP}&databaseKey=${apiUrl?.databaseKey}`;
            const deliveryData = await getRequest(url);

            const customerData = deliveryData.GetReceiptVendorjs?.Table[0];
            const stock = deliveryData.GetReceiptVendorjs?.Table1;

            if (customerData) {
                setCustomer(customerData);
                setStockData(stock);
                setFormData((prev) => ({
                    ...prev,
                    VCode: customerData.VCode,
                    Vname: customerData.Vname,
                    Vid: customerData.Vid,
                }));
            }

        } catch (error) {
            console.error('Error fetching receipt data:', error);
        }
    };

    const handleFormChange = (key: any, value1: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value1,
        }));
    };

    const handleSignature = (signature: any) => {
        Alert.alert('Signature Captured', 'Signature saved successfully!');
        setFormData((prev) => ({
            ...prev,
            SigfileNameOnly: signature,
        }));
    };

    const handleStartSigning = () => {
        setIsSigning(true);
    };

    const handleEndSigning = () => {
        setIsSigning(false);
    };

    const handleClear = () => {
        if (signatureRef.current) {
            signatureRef.current.clearSignature();

            setFormData({
                ...formData,
                SigfileNameOnly: '',
            });
            handleEndSigning();
        }
    };

    const handleConfirm = () => {
        if (signatureRef.current) {
            signatureRef.current.readSignature();
        }
        handleEndSigning();
    };

    const handleSubmitData = async () => {
        if (!formData) {
            Alert.alert('Error', 'Form data is missing');
            return;
        }

        if (!formData.SqlAction || !formData || !formData.ItemNo) {
            Alert.alert('Error', 'Missing required data');
            return;
        }

        try {
            const stringData = encodeURIComponent(JSON.stringify(formData));

            const requestUrl = `${apiUrl.url}/SaveDeliveryReceiptfn?SqlAction=${formData.SqlAction}&JsonData=${stringData}&databaseKey=${apiUrl.databaseKey}`;

            const savedData = await getRequest(requestUrl);

            if (savedData && savedData.SaveDeliveryReceiptfnjs) {
                Alert.alert('Success', 'Data saved successfully!');
                const recId = savedData.SaveDeliveryReceiptfnjs.Table1[0]?.RecId;
                handleResetForm();
                if (recId) {
                    navigation.navigate('PrintRecipts', {
                        recId: recId,
                        docType: 'DC',
                    });
                } else {
                    Alert.alert('Error', 'No receipt ID found in the response.');
                }
            } else {
                Alert.alert('Error', 'Failed to save data. Please try again.');
            }
        } catch (error) {
            console.error('Error during API request: ', error);
            Alert.alert('Error', 'An error occurred while saving data. Please try again.');
            handleResetForm();
        }
    };

    const handleResetForm = () => {
        setFormData({
            SqlAction: 'insert',
            RecId: 0,
            SessionId: currentUser?.sessionId,
            DriverName: currentUser?.DrName || '',
            DriverId: currentUser?.Drid || '',
            Vid: 0,
            VCode: '',
            Vname: '',
            balQty: 0,
            DESPQTY: '',
            EMPTYQTY: '',
            Note: '',
            Itemid: 0,
            ItemNo: '',
            ClId: currentUser?.CLID || '',
            AuthCode: currentUser?.OTP || '',
            SigfileNameOnly: '',
        });
        handleClear();
    };

    useEffect(() => {
        if (stockData && stockData.length > 0) {
            const dropDownData: IDropDown[] = stockData.map((item) => ({
                label: item.ItemNo,
                value: item.ItemId,
                isActive: false,
            }));
            setDropDown(dropDownData);
        }
    }, [stockData]);

    useEffect(() => {
        handleGetDelivery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SafeAreaView
            style={styles.container}
        >
            <View>
                <Text style={styles.headTitle}>{customer?.Vname || 'Form'}</Text>
                <Text style={styles.headSubtitle}>Contact: {customer?.mobile}, {customer?.phone}</Text>
            </View>
            <Text style={styles.Delivery}>Delivery Form</Text>
            <ScrollView
                // eslint-disable-next-line react-native/no-inline-styles
                contentContainerStyle={{
                    paddingBottom: 320,
                }}
                scrollEnabled={!isSigning}
            >
                <Text style={styles.sizes}>Select Cylinder Size *</Text>
                <View
                    style={styles.dropdownContainer}
                >
                    {dropDown && dropDown.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                const filteredata = stockData.filter((d => d.ItemNo === item.label))[0];
                                setFormData({
                                    ...formData,
                                    Itemid: filteredata.ItemId,
                                    ItemNo: filteredata.ItemNo.toString(),
                                    balQty: filteredata.BalanceQty,
                                });
                                dropDown.forEach(dropDownItem => {dropDownItem.isActive = false;});
                                item.isActive = true;
                            }}
                            style={[styles.sizesCircle, item.isActive && styles.dropdownTextActive]}
                        >
                            <Text style={styles.dropdownText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <CustomInput
                    title="Balance Qty *"
                    placeholder="Enter balance qty"
                    value={formData.balQty?.toString()}
                    disabled={true}
                    type="default"
                />

                <CustomInput
                    title="Desp Qty *"
                    placeholder="Enter desp 1ty"
                    value={formData.DESPQTY?.toString()}
                    type="numeric"
                    handleChangeText={(e) => handleFormChange('DESPQTY', e)}
                    disabled={false}
                />

                <CustomInput
                    title="Empty Qty *"
                    placeholder="Enter empty qty"
                    value={formData.EMPTYQTY?.toString()}
                    handleChangeText={(e) => handleFormChange('EMPTYQTY', e)}
                    type="numeric"
                    disabled={false}
                />

                <CustomInput
                    title="Notes"
                    placeholder="Enter Notes"
                    value={formData.Note?.toString()}
                    handleChangeText={(e) => handleFormChange('Note', e)}
                    disabled={false}
                    type="default"
                />

                <View
                    style={styles.signatureContainer}
                >
                    <SignatureView
                        ref={signatureRef}
                        onOK={handleSignature}
                        onBegin={handleStartSigning}
                        onEnd={handleEndSigning}
                        onEmpty={() => Alert.alert('Empty', 'Please provide a signature.')}
                        descriptionText="Sign Here"
                        webStyle={webStyle}
                    />

                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={handleClear}>
                            <Text style={styles.buttonText}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity onPress={handleClear}>
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleConfirm}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
                <SettingsButton
                    title="Save Delivery"
                    isLoading={false}
                    handlePress={handleSubmitData}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Delivery;

const webStyle = `
    .m-signature-pad {
        margin: 0;
        padding: 0;
    }
    .m-signature-pad--body {
        border: 0;
        height: 100%;
    }
    .m-signature-pad--footer {
        display: none;
    }
`;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: COLORS.primaryBlackHex,
        height: '100%',
    },
    dropdownContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        gap: 20,
    },
    dropdownText: {
        color: COLORS.primaryWhiteHex,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dropdownTextActive: {
        backgroundColor: COLORS.primaryOrangeHex,
        borderColor: COLORS.primaryOrangeHex,
    },
    headContainer: {
        lineHeight: 10,
        marginTop: 20,
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
        letterSpacing: 2,
        fontFamily: 'Poppins-Light',
    },
    Delivery: {
        fontSize: 24,
        color: COLORS.primaryWhiteHex,
        marginVertical: 20,
        fontWeight: 700,
        letterSpacing: 2,
    },
    sizes: {
        fontSize: 16,
        color: COLORS.primaryWhiteHex,
        marginBottom: 10,
        fontFamily: 'Poppins-Medium',
        letterSpacing: 1,
    },
    sizesCircle: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderColor: COLORS.primaryWhiteHex,
        borderWidth: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        display: 'none',
    },
    buttonText: {
        color: COLORS.primaryWhiteHex,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        letterSpacing: 1,
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
    },
    signatureContainer: {
        height: '40%',
    },
});
