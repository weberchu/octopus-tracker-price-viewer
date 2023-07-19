import AWS from 'aws-sdk';
import fs from 'fs';
import Handlebars from "handlebars";

const s3 = new AWS.S3();
const key = `price.html`;
const bucketName = 'octopus-tracker';

const uploadToS3 = async (fileContent) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        CacheControl: "max-age=10",
        ContentType: "text/html"
    };

    try {
        const response = await s3.upload(params).promise();
        console.info('File uploaded successfully:', response.Location);
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

const getPrices = () => {
    return {
        prices: [
            {
                date: "7/19",
                electricityPrice: "12.34p",
                gasPrice: "12.34p",
            },
            {
                date: "7/20",
                electricityPrice: "14.34p",
                gasPrice: "14.34p",
            }
        ],
        lastUpdateTime: new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })
    };
}

const generateHtml = (prices) => {
    const template = fs.readFileSync("./src/template/price.hbs", {encoding: "utf8", flag: "r"});
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(prices);
}

export const handler = async (event, context) => {
    const prices = getPrices();
    const htmlContent = generateHtml(prices);
    console.info("htmlContent = " + htmlContent);
    return await uploadToS3(htmlContent);
}
