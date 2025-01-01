import { Product, Region } from "./types";

type EnergyInfo = {
    tariffPrefix: string;
    tariffPath: string;
};

const octopusApi = {
    baseProductUrl: "https://api.octopus.energy/v1/products/",
    standardUnitRates: "standard-unit-rates",
    electricityInfo: {
        tariffPrefix: "E-1R-",
        tariffPath: "electricity-tariffs",
    },
    gasInfo: {
        tariffPrefix: "G-1R-",
        tariffPath: "gas-tariffs",
    },
};

const energyUrl = (info: EnergyInfo, region: Region, product: Product) => {
    return (
        `${octopusApi.baseProductUrl}${product.code}` +
        `/${info.tariffPath}` +
        `/${info.tariffPrefix}${product.code}-${region.code}` +
        `/${octopusApi.standardUnitRates}`
    );
};

export const electricityUrl = (region: Region, product: Product) => {
    return energyUrl(octopusApi.electricityInfo, region, product);
};

export const gasUrl = (region: Region, product: Product) => {
    return energyUrl(octopusApi.gasInfo, region, product);
};
