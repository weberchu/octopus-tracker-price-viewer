import { APIGatewayProxyEvent } from "aws-lambda";
import { generateHtml } from "./html-generator";
import { uploader } from "./uploader";
import { getPrices } from "./price-generator";

export const handler = async (event: APIGatewayProxyEvent) => {
    console.info("handler started");
    const prices = await getPrices();
    console.info("prices generated");
    const htmlContent = generateHtml(prices);
    console.info("htmlContent = " + htmlContent);
    return await uploader.uploadToS3(htmlContent);
}