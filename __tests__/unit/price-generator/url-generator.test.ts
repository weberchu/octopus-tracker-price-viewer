import { electricityUrl, gasUrl } from "../../../src/price-generator/url-generator";
import { Product, Region } from "../../../src/price-generator/types";

describe("url-generator", () => {
    describe("electricityUrl", () => {
        test("should return with correct region and product code", () => {
            expect(electricityUrl(Region.London, Product.November2022v1))
                .toEqual("https://api.octopus.energy/v1/products/SILVER-FLEX-22-11-25/electricity-tariffs/E-1R-SILVER-FLEX-22-11-25-C/standard-unit-rates");
            expect(electricityUrl(Region.SouthEasternEngland, Product.December2023v1))
                .toEqual("https://api.octopus.energy/v1/products/SILVER-23-12-06/electricity-tariffs/E-1R-SILVER-23-12-06-J/standard-unit-rates");
        });
    });

    describe("gasUrl", () => {
        test("should return with correct region and product code", () => {
            expect(gasUrl(Region.London, Product.November2022v1))
                .toEqual("https://api.octopus.energy/v1/products/SILVER-FLEX-22-11-25/gas-tariffs/G-1R-SILVER-FLEX-22-11-25-C/standard-unit-rates");
            expect(gasUrl(Region.SouthEasternEngland, Product.December2023v1))
                .toEqual("https://api.octopus.energy/v1/products/SILVER-23-12-06/gas-tariffs/G-1R-SILVER-23-12-06-J/standard-unit-rates");
        });
    });
});