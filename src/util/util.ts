import type { Order, Sale} from "./types"

export function peek<T>(arr: T[]){
    return arr[arr.length - 1]
}

export function makeSales(buyOrders: Order[], sellOrders: Order[]){
    if(buyOrders.length == 0 || sellOrders.length == 0){
        return {remainingSellOrders: sellOrders, remainingBuyOrders: buyOrders, sales: []}
    }
    const sells = [...sellOrders].sort((a, b) => b.price - a.price)
    const buys = [...buyOrders].sort((a, b) => a.price - b.price)

    const sales: Sale[] = []

    while(peek(buys).price >= peek(sells).price){
        const bestSellAmt = peek(sells).amount
        const bestBuyAmt = peek(buys).amount

        if(bestBuyAmt < bestSellAmt){
            const buyOrder = buys.pop()!
            sells[sells.length -1].amount -= buyOrder.amount
            sales.push({amount: buyOrder.amount, price: peek(sells).price})
        }
        else if(bestBuyAmt == bestSellAmt){
            const buyOrder = buys.pop()!
            const sellOrder = sells.shift()!
            sales.push({amount: buyOrder.amount, price: sellOrder.price})
        }else{
            const sellOrder = sells.shift()!
            buys[buys.length - 1].amount -= sellOrder.amount
            sales.push({amount: sellOrder.amount, price: sellOrder.price})
        }

        if(buys.length == 0 || sells.length == 0) break
    }
    
    return {remainingSellOrders: sells, remainingBuyOrders: buys, sales}
}

export function generateRandomOrder(marketPrice: number): Order{
    const orderType = Math.random() < 0.5 ? "buy" : "sell"
    const orderAmount = Math.round(Math.random()*100)
    const orderPrice = Math.round(marketPrice + Math.random()*100 * 100)/100
    
    return {type: orderType, amount: orderAmount, price: orderPrice}
}