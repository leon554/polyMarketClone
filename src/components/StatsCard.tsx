import { useEffect, useMemo, useRef } from "react"
import type { Order, Sale } from "../util/types"
import { formatNumber, mapToArr } from "../util/util"

interface Props{
    buyOrders: Map<number, Order>
    sellOrders: Map<number, Order>
    sales: Sale[]
}
export default function StatsCard({buyOrders, sellOrders, sales} : Props) {
    const maxBuyAmt = useRef(0)
    const maxSellAmt = useRef(0)

    const buyLiquidity = useMemo(() => mapToArr(buyOrders).reduce((a, c) => a + (c.price * c.amount), 0), [buyOrders])
    const sellLiquidity = useMemo(() => mapToArr(sellOrders).reduce((a, c) => a + (c.price * c.amount), 0), [sellOrders])
    const higestBuyOffer = useMemo(() => Math.max(...mapToArr(buyOrders).map(o => o.price)), [buyOrders])
    const lowestSellOffer = useMemo(() => Math.min(...mapToArr(sellOrders).map(o => o.price)), [sellOrders])
    const transactionVolume = useMemo(() => sales.slice(-1000).reduce((a, c) => a + (c.price * c.amount), 0), [sales])


    useEffect(() => {
        maxBuyAmt.current = Math.max(...mapToArr(buyOrders).map(a => a.amount))
        maxSellAmt.current = Math.max(...mapToArr(sellOrders).map(a => a.amount))
    }, [buyOrders.size, sellOrders.size])

    return (
        <div className="flex flex-col gap-3 bg-neutral-600 m-4 mt-0 p-4 rounded-lg ">
        <p className="text-white font-mono">
            Orders
        </p>
        <div className="flex flex-col gap-0.5 max-h-120">
            <div className="flex gap-5 justify-between bg-neutral-700 items-center p-1 rounded-md">
                <p className="font-mono text-gray-300 text-xs whitespace-nowrap">
                    Buy Liquidity: ${formatNumber(buyLiquidity)}
                </p>
                <div 
                    className="bg-green-500 h-5 rounded-md"
                    style={{width: `${buyLiquidity/(sellLiquidity+buyLiquidity)*100}%`}}
                >
                </div>
            </div>
            <div className="flex gap-5 justify-between bg-neutral-700 items-center p-1 rounded-md">
                <p className="font-mono text-gray-300 text-xs whitespace-nowrap">
                    Sell Liquidity: ${formatNumber(sellLiquidity)}
                </p>
                <div 
                    className="bg-red-500 h-5 rounded-md"
                    style={{width: `${sellLiquidity/(sellLiquidity+buyLiquidity)*100}%`}}
                >
                </div>
            </div>
            <div className="flex gap-5 justify-between bg-neutral-700 items-center p-1 rounded-md">
                <p className="font-mono text-gray-300 text-xs whitespace-nowrap">
                    Highest Buy Offer: ${formatNumber(higestBuyOffer)}
                </p>
            </div>
            <div className="flex gap-5 justify-between bg-neutral-700 items-center p-1 rounded-md">
                 <p className="font-mono text-gray-300 text-xs whitespace-nowrap">
                    Lowest Sell Offer: ${formatNumber(lowestSellOffer)}
                </p>
            </div>
            <div className="flex gap-5 justify-between bg-neutral-700 items-center p-1 rounded-md">
                 <p className="font-mono text-gray-300 text-xs whitespace-nowrap">
                    Buy Sell Delta: ${Math.round(Math.abs(higestBuyOffer - lowestSellOffer)*100)/100}
                </p>
            </div>
            <div className="flex gap-5 justify-between bg-neutral-700 items-center p-1 rounded-md">
                 <p className="font-mono text-gray-300 text-xs whitespace-nowrap">
                    Last 1k Transaction Volume: ${formatNumber(transactionVolume)}
                </p>
            </div>
        </div>
    </div>
    )
}
