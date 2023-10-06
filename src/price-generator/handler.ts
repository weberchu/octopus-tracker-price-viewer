import { APIGatewayProxyEvent } from "aws-lambda";
import { generateHtml } from "./html-generator";
import { uploader } from "./uploader";
import { getPrices } from "./price-generator";
import { Region } from "./types";

export const handler = async (event: APIGatewayProxyEvent) => {
    console.info("handler started");
    const generationTimeStamp = new Date();

    for (const region of Region.ALL) {
        const prices = await getPrices(region);
        console.info("[" + region.name + "] prices generated");

        const htmlContent = generateHtml(region, prices, generationTimeStamp);
        console.info("[" + region.name + "] htmlContent generated");

        for (const pageName of region.pageNames) {
            await uploader.uploadToS3(htmlContent, pageName);
            console.info("[" + region.name + "] uploaded to " + pageName);
        }
    }
}