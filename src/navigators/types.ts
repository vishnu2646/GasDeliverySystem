export interface IAuthStateValues {
    title: String;
    focused: boolean;
    color: String;
    size: number;
}

export type RootStackParamList = {
    Login: undefined;
    Settings: undefined;
    MainTabs: undefined;
    Splash: undefined;
    Delivery: { vid: number };
    Recipt: { vid: number };
    PrintRecipts: { recId: number, docType: string };
};
