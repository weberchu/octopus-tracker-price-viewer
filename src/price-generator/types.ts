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

export class Region {
    static EasternEngland = new Region("Eastern England", "A", "eastern_england");
    static EastMidlands = new Region("East Midlands", "B", "east_midlands");
    static London = new Region("London", "C", "london");
    static MerseysideAndNorthernWales = new Region("Merseyside and Northern Wales", "D", "merseyside_and_northern_wales");
    static WestMidlands = new Region("West Midlands", "E", "west_midlands");
    static NorthEasternEngland = new Region("North Eastern England", "F", "north_eastern_england");
    static NorthWesternEngland = new Region("North Western England", "G", "north_western_england");
    static SouthernEngland = new Region("Southern England", "H", "southern_england");
    static SouthEasternEngland = new Region("South Eastern England", "J", "south_eastern_england");
    static SouthernWales = new Region("Southern Wales", "K", "southern_wales");
    static SouthWesternEngland = new Region("South Western England", "L", "south_western_england");
    static Yorkshire= new Region("Yorkshire", "M", "yorkshire");
    static SouthernScotland = new Region("Southern Scotland", "N", "southern_scotland");
    static NorthernScotland = new Region("Northern Scotland", "P", "northern_scotland");
    static ALL = [
        Region.EasternEngland,
        Region.EastMidlands,
        Region.London,
        Region.MerseysideAndNorthernWales,
        Region.WestMidlands,
        Region.NorthEasternEngland,
        Region.NorthWesternEngland,
        Region.SouthernEngland,
        Region.SouthEasternEngland,
        Region.SouthernWales,
        Region.SouthWesternEngland,
        Region.Yorkshire,
        Region.SouthernScotland,
        Region.NorthernScotland,
    ];

    constructor(readonly name: string, readonly code: string, readonly pageName: string) {}
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