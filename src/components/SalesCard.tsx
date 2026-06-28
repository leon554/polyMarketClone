import type { Sale } from "../util/types"

interface Props{
    sales: Sale[]
}
export default function SalesCard({sales}: Props) {
    return (
        <div className="flex flex-col gap-3 bg-neutral-600 m-4 mt-0 p-4 rounded-lg h-62">
        <p className="text-white font-mono">
            Sales
        </p>
        <div className="max-h-70  flex flex-col gap-0.5">
            {sales.slice(-7).reverse().map(s => {
                return(
                    <div className="bg-neutral-700 p-1 rounded-md flex  justify-between gap-5">
                        <p className="font-mono text-xs text-red-500">
                            ${s.price} x {s.amount} | {s.buyOrder} | {s.sellOrder}
                        </p>
                    </div>
                )
            })}
        </div>
    </div>
    )
}
