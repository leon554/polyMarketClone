export interface Order{
    id: string
    type: "buy" | "sell"
    price: number
    amount: number
}

export interface Sale{
    id: string
    price: number,
    amount: number
    buyOrder: string
    sellOrder: string

}

export interface SaleStepOutput{
    remainingSellOrders: Map<number, Order>;
    remainingBuyOrders: Map<number, Order>;
    sales: Sale[];
}