import { ChartParameters } from "chart-le";


export function getChartParameters(){
    const cp = new ChartParameters()
    cp.maxDataPoints = 250
    cp.displayDataPoints = false
    return cp
}