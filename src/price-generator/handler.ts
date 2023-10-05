import { APIGatewayProxyEvent } from "aws-lambda";
import { generateHtml } from "./html-generator";
import { uploader } from "./uploader";
import { getPrices } from "./price-generator";
import { Region } from "./types";

export const handler = async (event: APIGatewayProxyEvent) => {
    console.info("handler started");
    const region = Region.London;
    const generationTimeStamp = new Date();

    const prices = await getPrices(region);
    console.info("prices generated");
    const htmlContent = generateHtml(region, prices, generationTimeStamp);
    console.info("htmlContent = " + htmlContent);
    return await uploader.uploadToS3(htmlContent);
}