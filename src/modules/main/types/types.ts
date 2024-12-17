export interface IGasStocks {
    StkInVhl: number;
    slno: number;
    Opening: number;
    ItemNo: number;
    Despatch: number;
}

export interface IDelivery {
    Vid: number;
    Vcode: String;
    Vname: String;
    RouteName: String;
    Action: number;
    Mobile: String;
    phone: String;
    Address: String;
    Balance: number;
}

export interface ITotals {
    Cash: number;
    Others: number;
    Total: number;
    clid: number;
}

export enum CustomTab {
    Delivery,
    Recipt
}

export type ITabButtonType = {
    title: string
};
