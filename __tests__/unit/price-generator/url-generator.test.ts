import { electricityUrl, gasUrl } from "../../../src/price-generator/url-generator";
import { Region } from "../../../src/price-generator/types";

describe("url-generator", () => {
    describe("electricityUrl", () => {
        test("should return with correct region", () => {
            expect(electricityUrl(Region.London))
                .toEqual("https://api.octopus.energy/v1/products/SILVER-FLEX-22-11-25/electricity-tariffs/E-1R-SILVER-FLEX-22-11-25-C/standard-unit-rates");
            expect(electricityUrl(Region.South_Eastern_England))
                .toEqual("https://api.octopus.energy/v1/products/SILVER-FLEX-22-11-25/electricity-tariffs/E-1R-SILVER-FLEX-22-11-25-J/standard-unit-rates");
        });
    });

    describe("gasUrl", () => {
        test("should return with correct region", () => {
            expect(gasUrl(Region.London))
                .toEqual("https://api.octopus.energy/v1/products/SILVER-FLEX-22-11-25/gas-tariffs/G-1R-SILVER-FLEX-22-11-25-C/standard-unit-rates");
            expect(gasUrl(Region.South_Eastern_England))
                .toEqual("https://api.octopus.energy/v1/products/SILVER-FLEX-22-11-25/gas-tariffs/G-1R-SILVER-FLEX-22-11-25-J/standard-unit-rates");
        });
    });
});