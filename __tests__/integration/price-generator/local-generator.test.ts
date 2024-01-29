import { Product, Region } from "../../../src/price-generator/types";
import { generateHtml } from "../../../src/price-generator/html-generator";
import fs from "fs";

const generate = async (region: Region, product: Product) => {
    const generationTimeStamp = new Date();

    const prices = [
        {
            date: "10/07",
            electricityPrice: "21.10",
            gasPrice: "2.04",
        },
        {
            date: "11/07",
            electricityPrice: "23.09",
            gasPrice: "4.05",
        },
        {
            date: "12/07",
            electricityPrice: "10.20",
        },
    ];

    const htmlContent = generateHtml(region, product, prices, generationTimeStamp);

    fs.writeFileSync("./test-output/" + product.code + "/" + region.pageNames[0], htmlContent);
}

/**
 * Not a test. Run this to generate an HTML for manual verification.
 */
describe("local-generator", () => {
    test("generate", async () => {
        await generate(Region.London, Product.November2022v1);
        await generate(Region.London, Product.December2023v1);
        await generate(Region.EasternEngland, Product.November2022v1);
        await generate(Region.EasternEngland, Product.December2023v1);
    });
});

