import { APIGatewayProxyEvent } from "aws-lambda";
import { generateHtml } from "./html-generator";
import { uploader } from "./uploader";
import { getPrices } from "./price-generator";
import { Product, Region } from "./types";

export const handler = async (event: APIGatewayProxyEvent) => {
    console.info("handler started");
    const generationTimeStamp = new Date();

    for (const product of Product.ALL) {
        for (const region of Region.ALL) {
            const prices = await getPrices(region, product);
            console.info("[" + product.code + "-" + region.name + "] prices generated");

            const htmlContent = generateHtml(region, product, prices, generationTimeStamp);
            console.info("[" + product.code + "-" + region.name + "] htmlContent generated");

            for (const pageName of region.pageNames) {
                const filenames = [];
                if (product == Product.November2022v1) {
                    filenames.push(pageName); // backwards compatibility with url without product code
                }
                filenames.push(product.code + "/" + pageName);
                for (const filename of filenames) {
                    await uploader.uploadToS3(htmlContent, filename);
                    console.info("[" + product.code + "-" + region.name + "] uploaded to " + filename);
                }
            }
        }
    }
}