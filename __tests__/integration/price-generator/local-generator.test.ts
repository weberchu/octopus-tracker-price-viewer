import { Region } from "../../../src/price-generator/types";
import { generateHtml } from "../../../src/price-generator/html-generator";
import fs from "fs";

const generate = async (region: Region) => {
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

    const htmlContent = generateHtml(region, prices, generationTimeStamp);

    fs.writeFileSync("./test-output/" + region.pageNames[0], htmlContent);
}

/**
 * Not a test. Run this to generate an HTML for manual verification.
 */
describe.skip("local-generator", () => {
    test("generate", async () => {
        await generate(Region.London);
        await generate(Region.EasternEngland);
        await generate(Region.EastMidlands);
    });
});

