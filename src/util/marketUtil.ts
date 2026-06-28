import type { Order, Sale} from "./types"
import { mapToArr, peek } from "./util"

export function makeSales(buyOrders: Map<number, Order>, sellOrders: Map<number, Order>){
    if(buyOrders.size == 0 || sellOrders.size == 0){
        return {remainingSellOrders: sellOrders, remainingBuyOrders: buyOrders, sales: []}
    }
    const sells = [...mapToArr(sellOrders)].sort((a, b) => b.price - a.price)
    const buys = [...mapToArr(buyOrders)].sort((a, b) => a.price - b.price)

    const sales: Sale[] = []
    
    while(buys.length != 0 && sells.length != 0){
        const bestSell = peek(sells)
        const bestBuy = peek(buys)

        if(bestBuy.price < bestSell.price) break
        const maxSharedAmt = Math.min(bestBuy.amount, bestSell.amount)

        sales.push({
            id: crypto.randomUUID(), 
            amount: maxSharedAmt, 
            price: bestSell.price,
            buyOrder: orderToString(bestBuy),
            sellOrder: orderToString(bestSell)
        })

        bestBuy.amount -= maxSharedAmt
        bestSell.amount -= maxSharedAmt

        if(bestBuy.amount == 0) buys.pop()
        if(bestSell.amount == 0) sells.pop()
    }
    
    return {remainingSellOrders: orderArrToMap(sells), remainingBuyOrders: orderArrToMap(buys), sales}
}

let artificialMarketPrice = 100
function updateMarketPrice(){
    let pressure = Math.random()
    artificialMarketPrice += pressure < 0.5 ? 1 : -1
}

export function generateRandomOrder(): Order{
    updateMarketPrice()
    const orderType = Math.random() < 0.5 ? "buy" : "sell"
    const orderAmount = Math.round(Math.random()*100)
    const orderPrice = Math.round((artificialMarketPrice + Math.random()) * 100)/100
    
    return {id: crypto.randomUUID(), type: orderType, amount: orderAmount, price: orderPrice}
}

export function orderArrToMap(arr: Order[]){
    return new Map(arr.map(v => [v.price, v]))
}

export function orderToString(order: Order){
    return `[${order.price} x ${order.amount}]-[${order.type}]`
}