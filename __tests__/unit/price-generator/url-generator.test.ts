import { electricityUrl, gasUrl } from "../../../src/price-generator/url-generator";
import { Product, Region } from "../../../src/price-generator/types";

describe("url-generator", () => {
    describe("electricityUrl", () => {
        test("should return with correct region and product code", () => {
            expect(electricityUrl(Region.London, Product.April2025v1)).toEqual(
                "https://api.octopus.energy/v1/products/SILVER-25-04-11/electricity-tariffs/E-1R-SILVER-25-04-11-C/standard-unit-rates"
            );
            expect(electricityUrl(Region.SouthEasternEngland, Product.September2025v1)).toEqual(
                "https://api.octopus.energy/v1/products/SILVER-25-09-02/electricity-tariffs/E-1R-SILVER-25-09-02-J/standard-unit-rates"
            );
            expect(electricityUrl(Region.Yorkshire, Product.December2024v1)).toEqual(
                "https://api.octopus.energy/v1/products/SILVER-24-12-31/electricity-tariffs/E-1R-SILVER-24-12-31-M/standard-unit-rates"
            );
        });
    });

    describe("gasUrl", () => {
        test("should return with correct region and product code", () => {
            expect(gasUrl(Region.London, Product.April2025v1)).toEqual(
                "https://api.octopus.energy/v1/products/SILVER-25-04-11/gas-tariffs/G-1R-SILVER-25-04-11-C/standard-unit-rates"
            );
            expect(gasUrl(Region.SouthEasternEngland, Product.September2025v1)).toEqual(
                "https://api.octopus.energy/v1/products/SILVER-25-09-02/gas-tariffs/G-1R-SILVER-25-09-02-J/standard-unit-rates"
            );
            expect(gasUrl(Region.Yorkshire, Product.December2024v1)).toEqual(
                "https://api.octopus.energy/v1/products/SILVER-24-12-31/gas-tariffs/G-1R-SILVER-24-12-31-M/standard-unit-rates"
            );
        });
    });
});
