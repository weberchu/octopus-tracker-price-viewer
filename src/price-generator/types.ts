export type OctopusStandardUnitRates = {
    count: number,
    results: OctopusResult[],
}

export type OctopusResult = {
    value_exc_vat: number,
    value_inc_vat: number,
    valid_from: string,
    valid_to: string,
}

export enum Region {
    Eastern_England = "A",
    East_Midlands = "B",
    London = "C",
    Merseyside_and_Northern_Wales = "D",
    West_Midlands = "E",
    North_Eastern_England = "F",
    North_Western_England = "G",
    Southern_England = "H",
    South_Eastern_England = "J",
    Southern_Wales = "K",
    South_Western_England = "L",
    Yorkshire_= "M",
    Southern_Scotland = "N",
    Northern_Scotland = "P",
}

export type Price = {
    date: string
    electricityPrice?: string
    gasPrice?: string
}
export type Prices = {
    prices: Price[],
    lastUpdateTime: string,
}