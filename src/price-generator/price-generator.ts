import { Price, Product, Region } from "./types";
import { electricityUrl, gasUrl } from "./url-generator";
import { getSingleFuel } from "./single-fuel-fetcher";
import { findPrice } from "./price-finder";
import { toDateString } from "./date-time-formatter";

export const getPrices = async (region: Region, product: Product): Promise<Price[]> => {
    const electricityPrices = await getSingleFuel(electricityUrl(region, product));
    const gasPrices = await getSingleFuel(gasUrl(region, product));

    const now = new Date();
    const todayEpoch = now.getTime();
    const yesterday = new Date(todayEpoch - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(todayEpoch + 24 * 60 * 60 * 1000);

    const prices = [
        {
            date: toDateString(yesterday),
            electricityPrice: findPrice(yesterday, electricityPrices)?.toFixed(2),
            gasPrice: findPrice(yesterday, gasPrices)?.toFixed(2),
        },
        {
            date: toDateString(now),
            electricityPrice: findPrice(now, electricityPrices)?.toFixed(2),
            gasPrice: findPrice(now, gasPrices)?.toFixed(2),
        }
    ];

    const tomorrowElectricityPrice = findPrice(tomorrow, electricityPrices)?.toFixed(2);
    const tomorrowGasPrice = findPrice(tomorrow, gasPrices)?.toFixed(2);
    if (tomorrowElectricityPrice || tomorrowGasPrice) {
        prices.push({
            date: toDateString(tomorrow),
            electricityPrice: tomorrowElectricityPrice,
            gasPrice: tomorrowGasPrice,
        });
    }

    return prices;
}

