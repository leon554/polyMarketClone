import { useEffect, useRef, useState } from "react"
import type { Order, Sale, SaleStepOutput } from "../util/types"
import { Chart} from "chart-le"
import { getChartParameters } from "../util/chartUtil"
import Button from "./Button"
import { generateRandomOrder, makeSales} from "../util/marketUtil"
import { peek } from "../util/util"
import { addToOrderMap} from "../util/util"

export default function BetCard() {
    const canvasID = useRef<HTMLCanvasElement | null>(null)
    const [buyOrders, setBuyOrders] = useState<Map<number, Order>>(new Map())
    const [sellOrders, setSellOrders] = useState<Map<number, Order>>(new Map())
    const chart = useRef<Chart | null>(null)
    const [price, setPrice] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [sales, setSales] = useState<Sale[]>([])
    const salesRef = useRef(sales)
    const [autoOrders, setAutoOrders] = useState(false)

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
           const order = generateRandomOrder(peek(salesRef.current)?.price ?? 100)
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
        output?.sales.forEach(s => chart.current!.addXY("", s.price))
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
                            className="bg-slate-100 rounded-sm font-mono outline-none focus:outline-none 
                            focus:ring-0 focus:border-transparent w-20"
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
                            className="bg-slate-100 rounded-sm font-mono outline-none focus:outline-none 
                            focus:ring-0 focus:border-transparent w-20"
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
            <div className="flex w-full justify-between">
                <div className="flex flex-col gap-3 bg-neutral-600 m-4 mt-0 p-4 rounded-lg w-full">
                    <p className="text-white font-mono">
                        Orders
                    </p>
                    <div className="flex flex-col gap-4 max-h-70 overflow-y-scroll">
                        <div>
                            <p className="font-mono text-gray-300 text-xs">
                                Buy
                            </p>
                            {Array.from(buyOrders.values()).filter(o => o.type == "buy").sort((a, b) => a.price - b.price).slice(-10).map(o => {
                                return(
                                    <div>
                                        <p className="font-mono text-xs text-green-500">
                                            ${o.price} x {o.amount}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                        <div>
                            {Array.from(sellOrders.values()).filter(o => o.type == "sell").sort((a, b) => a.price - b.price).slice(0, 10).map(o => {
                                return(
                                    <div>
                                        <p className="font-mono text-xs text-red-500">
                                            ${o.price} x {o.amount}
                                        </p>
                                    </div>
                                )
                            })}
                            <p className="font-mono text-gray-300 text-xs">
                                Sell
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 bg-neutral-600 m-4 mt-0 p-4 rounded-lg w-full">
                    <p className="text-white font-mono">
                        Sales
                    </p>
                    <div className="max-h-70 overflow-y-scroll">
                        {sales.slice(-20).reverse().map(s => {
                            return(
                                <div>
                                    <p className="font-mono text-xs text-red-500">
                                        ${s.price} x {s.amount}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
