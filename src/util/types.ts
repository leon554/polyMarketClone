export interface Order{
    type: "buy" | "sell"
    price: number
    amount: number
}

export interface Sale{
    price: number,
    amount: number
}