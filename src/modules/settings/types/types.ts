export interface ISettingsButtonProps {
    handlePress: () => void;
    title: String;
    isLoading: boolean;
}

export interface ICustomer {
    Note: String;
    VCode: String;
    Vid: number;
    Vname: String;
    mobile: String;
    phone: String;
}

export interface IStock {
    BalanceQty: number;
    ItemId: number;
    ItemNo: number;
}

export interface IDropDown {
    label: number;
    value: number;
    isActive: boolean;
}

export interface IPrintResponse {
    id: any;
    model: any;
}

export interface ICustomerData {
    Mobile: String;
    Note: String;
    Phone: String;
    VCode: String;
    Vid: number;
    Vname: String;
}

export interface IPayMode {
    PMName: String;
    label: String;
    value: String;
}
