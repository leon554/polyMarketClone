import { useEffect, useRef, useState } from "react"
import type { Order, Sale, SaleStepOutput } from "../util/types"
import { Chart} from "chart-le"
import { getChartParameters } from "../util/chartUtil"
import Button from "./Button"
import { generateRandomOrder, makeSales} from "../util/marketUtil"
import { addToOrderMap} from "../util/util"
import OrderBook from "./OrderBook"
import SalesCard from "./SalesCard"
import StatsCard from "./StatsCard"

export default function BetCard() {
    const canvasID = useRef<HTMLCanvasElement | null>(null)
    const [buyOrders, setBuyOrders] = useState<Map<number, Order>>(new Map())
    const [sellOrders, setSellOrders] = useState<Map<number, Order>>(new Map())
    const chart = useRef<Chart | null>(null)
    const [price, setPrice] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [sales, setSales] = useState<Sale[]>([])
    const [autoOrders, setAutoOrders] = useState(false)
    const acumulator = useRef<Sale[]>([])

    useEffect(() => {
        const canvas = canvasID.current as HTMLCanvasElement
        canvas.width = 500; canvas.height = 250
        if(!chart.current){
            chart.current = new Chart(canvas, getChartParameters())
        }
        const output = makeSales(buyOrders, sellOrders)
        applySalesOutput(output)
        chart.current.drawChart()
    }, [buyOrders.size, sellOrders.size])

    useEffect(() => {
        const intervalId = setInterval(() => {
           const order = generateRandomOrder()
            if (order.type === "buy") {
                setBuyOrders(p => addToOrderMap(p, order.price, order))
            } else {
                setSellOrders(p => addToOrderMap(p, order.price, order))
            }
        }, 100)
 
        if(!autoOrders) clearInterval(intervalId)
        return () => clearInterval(intervalId)
    }, [autoOrders])

    function applySalesOutput(output: SaleStepOutput){
        setSales([...sales, ...output.sales])
        acumulator.current.push(...output.sales)
        if(acumulator.current.length >= 10){
            chart.current!.addXY("", acumulator.current.reduce((a, c) => a + c.price, 0)/acumulator.current.length)
            acumulator.current = []
        }
        setBuyOrders(output.remainingBuyOrders)
        setSellOrders(output.remainingSellOrders)
    }


    return (
        <div className="bg-neutral-700 h-fit flex flex-col gap-3 rounded-xl">
            <canvas ref={canvasID}>

            </canvas>
            <div className="flex flex-col gap-3 bg-neutral-600 m-4 p-4 rounded-lg">
                <p className="text-white font-mono">
                    Make Transaction
                </p>
                <div className="flex gap-5">
                    <div className="flex items-center gap-2">
                        <p className="font-mono text-gray-300 text-xs">
                            Price
                        </p>
                        <input
                            type="number"
                            className="bg-neutral-700 text-gray-300 px-1 rounded-sm font-mono outline-none focus:outline-none 
                            focus:ring-0 focus:border-transparent"
                            step={0.1}
                            value={Number(price)}
                            onChange={v => setPrice(v.currentTarget.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-mono text-gray-300 text-xs">
                            Amount
                        </p>
                        <input
                            type="number"
                            className="bg-neutral-700 text-gray-300 px-1 w-full rounded-sm font-mono outline-none focus:outline-none 
                            focus:ring-0 focus:border-transparent"
                            step={1}
                            value={Number(amount)}
                            onChange={v => setAmount(v.currentTarget.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button 
                        label="Buy" 
                        onPress={() => {
                            setBuyOrders(p => addToOrderMap(p, Number(price), {id: crypto.randomUUID(), type: "buy", amount: Number(amount), price: Number(price)}))
                            setAmount(""); setPrice("")
                        }} 
                        style="w-full"
                    />
                    <Button 
                        label="Sell" 
                        onPress={() => {
                            setSellOrders(p => addToOrderMap(p, Number(price), {id: crypto.randomUUID(), type: "sell", amount: Number(amount), price: Number(price)}))
                            setAmount(""); setPrice("")
                        }} 
                        style="bg-red-500 w-full"
                    />
                    <Button 
                        label={autoOrders ? "Pause" : "Start"}
                        onPress={() => setAutoOrders(!autoOrders)} 
                        style="bg-orange-500 w-full"
                    />
                </div>
            </div>
            <div className="flex flex-col w-full">
                <StatsCard
                    buyOrders={buyOrders}
                    sellOrders={sellOrders}
                    sales={sales}
                />
                <OrderBook
                    buyOrders={buyOrders}
                    sellOrders={sellOrders}
                />
                <SalesCard
                    sales={sales}
                />
            </div>
        </div>
    )
}
