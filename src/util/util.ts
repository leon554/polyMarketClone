import type { Order } from "./types"

export function peek<T>(arr: T[]){
    return arr[arr.length - 1]
}

export function addToOrderMap( map: Map<number, Order>, key: number, value: Order) {
    const newMap = new Map(map)

    if (!newMap.has(key)) {
        newMap.set(key, value)
    } else {
        const existing = newMap.get(key)!
        const updated: Order = {...existing,amount: existing.amount + value.amount}
        newMap.set(key, updated)
    }

    return newMap
}

export function mapToArr<k, v>(map: Map<k, v>): v[]{
    return Array.from(map.values())
}