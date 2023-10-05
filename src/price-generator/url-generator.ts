import { Region } from "./types";

type EnergyInfo = {
    tariffPrefix: string,
    tariffPath: string,
}

const octopusApi = {
    baseProductUrl: "https://api.octopus.energy/v1/products/",
    productCode: "SILVER-FLEX-22-11-25",
    standardUnitRates: "standard-unit-rates",
    electricityInfo: {
        tariffPrefix: "E-1R-",
        tariffPath: "electricity-tariffs",
    },
    gasInfo: {
        tariffPrefix: "G-1R-",
        tariffPath: "gas-tariffs",
    }
}

const energyUrl = (info: EnergyInfo, region: Region) => {
    return `${octopusApi.baseProductUrl}${octopusApi.productCode}` +
    `/${info.tariffPath}` +
    `/${info.tariffPrefix}${octopusApi.productCode}-${region.code}` +
    `/${octopusApi.standardUnitRates}`;
}

export const electricityUrl = (region: Region) => {
    return energyUrl(octopusApi.electricityInfo, region);
}

export const gasUrl = (region: Region) => {
    return energyUrl(octopusApi.gasInfo, region);
}