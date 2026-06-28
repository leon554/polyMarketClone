import { useEffect, useRef } from "react"
import type { Order } from "../util/types"
import { mapToArr } from "../util/util"

interface Props{
    buyOrders: Map<number, Order>
    sellOrders: Map<number, Order>
}
export default function OrderBook({buyOrders, sellOrders} : Props) {
    const maxBuyAmt = useRef(0)
    const maxSellAmt = useRef(0)

    useEffect(() => {
        maxBuyAmt.current = Math.max(...mapToArr(buyOrders).map(a => a.amount))
        maxSellAmt.current = Math.max(...mapToArr(sellOrders).map(a => a.amount))
    }, [buyOrders.size, sellOrders.size])
    return (
        <div className="flex flex-col gap-3 bg-neutral-600 m-4 mt-0 p-4 rounded-lg h-134">
        <p className="text-white font-mono">
            Orders
        </p>
        <div className="flex flex-col gap-4 max-h-120">
            <div className="flex flex-col gap-0.5">
                <p className="font-mono text-gray-300 text-xs mb-1">
                    Buy
                </p>
                {mapToArr(buyOrders).sort((a, b) => a.price - b.price).slice(-8).map(o => {
                    return(
                        <div className="bg-neutral-700 p-1 rounded-md flex justify-between gap-5">
                            <p className="font-mono text-xs text-green-500 whitespace-nowrap">
                                ${o.price} x {o.amount}
                            </p>
                            <div 
                                className="bg-green-500 h-full rounded-md"
                                style={{width: `${o.amount/maxBuyAmt.current*100}%`}}
                            >
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex flex-col gap-0.5">
                {mapToArr(sellOrders).sort((a, b) => a.price - b.price).slice(0, 8).map(o => {
                    return(
                        <div className="bg-neutral-700 p-1 rounded-md flex  justify-between gap-5">
                            <p className="font-mono text-xs text-red-500 whitespace-nowrap">
                                ${o.price} x {o.amount}
                            </p>
                            <div 
                                className="bg-red-500 h-full rounded-md"
                                style={{width: `${o.amount/maxSellAmt.current*100}%`}}
                            >
                            </div>
                        </div>
                    )
                })}
                <p className="font-mono text-gray-300 text-xs mt-1">
                    Sell
                </p>
            </div>
        </div>
    </div>
    )
}
