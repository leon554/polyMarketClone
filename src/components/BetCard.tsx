import { useEffect, useRef, useState } from "react"
import type { Order, Sale } from "../util/types"
import { Chart} from "chart-le"
import { getChartParameters } from "../util/chartUtil"
import Button from "./Button"

export default function BetCard() {
    const canvasID = useRef<HTMLCanvasElement | null>(null)
    const [buyOrders, setBuyOrders] = useState<Order[]>([])
    const [sellOrders, setSellOrders] = useState<Order[]>([])
    const chart = useRef<Chart | null>(null)
    const [price, setPrice] = useState<number>(0)
    const [amount, setAmount] = useState<number>(0)
    const [sales, setSales] = useState<Sale[]>([])

    useEffect(() => {
        const canvas = canvasID.current as HTMLCanvasElement
        canvas.width = 500; canvas.height = 250
        if(!chart.current){
            chart.current = new Chart(canvas, getChartParameters())
        }
        makeSales()
        chart.current.drawChart()
    }, [buyOrders, sellOrders])

    function makeSales(){
        if(buyOrders.length == 0 || sellOrders.length == 0) return
        const sells = [...sellOrders].sort((a, b) => a.price -b.price)
        const buys = [...buyOrders].sort((a, b) => a.price -b.price)

        while(buys[buys.length-1].price >= sells[0].price){

            if(buys[buys.length-1].amount < sells[0].amount){
                const buyOrder = buys.pop()!
                sells[0].amount -= buyOrder.amount
                setSales([...sales, {amount: buyOrder.amount, price: sells[0].price}])
                chart.current?.addXY("", sells[0].price * 100)
            }
            else if(buys[buys.length-1].amount == sells[0].amount){
                const buyOrder = buys.pop()!
                const sellOrder = sells.shift()!
                setSales([...sales, {amount: buyOrder.amount, price: sellOrder.price}])
                chart.current?.addXY("", sellOrder.price * 100)
            }else{
                const sellOrder = sells.shift()!
                buys[buys.length - 1].amount -= sellOrder.amount
                setSales([...sales, {amount: sellOrder.amount, price: sellOrder.price}])
                chart.current?.addXY("", sellOrder.price * 100)
            }
            if(buys.length == 0 || sells.length == 0) break
        }
        setBuyOrders([...buys])
        setSellOrders([...sells])

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
                            onChange={v => setPrice(Number(v.currentTarget.value))}
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
                            onChange={v => setAmount(Number(v.currentTarget.value))}
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button 
                        label="Buy" 
                        onPress={() => {
                            setBuyOrders([...buyOrders, {type: "buy", amount, price}])
                            setAmount(0); setPrice(0)
                        }} 
                        style="w-full"
                    />
                    <Button 
                        label="Sell" 
                        onPress={() => {
                            setSellOrders([...sellOrders, {type: "sell", amount, price}])
                            setAmount(0); setPrice(0)
                        }} 
                        style="bg-red-500 w-full"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-3 bg-neutral-600 m-4 mt-0 p-4 rounded-lg">
                <p className="text-white font-mono">
                    Orders
                </p>
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="font-mono text-gray-300 text-xs">
                            Buy
                        </p>
                        {buyOrders.filter(o => o.type == "buy").sort((a, b) => a.price - b.price).map(o => {
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
                        {sellOrders.filter(o => o.type == "sell").sort((a, b) => a.price - b.price).map(o => {
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
             <div className="flex flex-col gap-3 bg-neutral-600 m-4 mt-0 p-4 rounded-lg">
                <p className="text-white font-mono">
                    Sales
                </p>
                
            </div>
        </div>
    )
}
