import AWS from 'aws-sdk';
import fs from 'fs';
import Handlebars from "handlebars";
import fetch from 'node-fetch';
import { APIGatewayProxyEvent } from "aws-lambda";
import { Result, StandardUnitRates } from "./types";
import templateLocation from "../template/price.hbs";

type Price = {
    date: string
    electricityPrice?: string
    gasPrice?: string
}

type Prices = {
    prices: Price[],
    lastUpdateTime: string,
}

const s3 = new AWS.S3();
const key = `price.html`;
const bucketName = 'octopus-tracker';
const octopusApi = {
    baseProductUrl: "https://api.octopus.energy/v1/products/",
    productCode: "SILVER-FLEX-22-11-25",
    electricityTariffPrefix: "E-1R-",
    gasTariffPrefix: "G-1R-",
    regionCode: "C",
    path: {
        electricityTariffPath: "electricity-tariffs",
        gasTariffPath: "gas-tariffs",
        standardUnitRates: "standard-unit-rates"
    }
}

const electricityUrl =
    `${octopusApi.baseProductUrl}${octopusApi.productCode}` +
    `/${octopusApi.path.electricityTariffPath}` +
    `/${octopusApi.electricityTariffPrefix}${octopusApi.productCode}-${octopusApi.regionCode}` +
    `/${octopusApi.path.standardUnitRates}`;

const gasUrl =
    `${octopusApi.baseProductUrl}${octopusApi.productCode}` +
    `/${octopusApi.path.gasTariffPath}` +
    `/${octopusApi.gasTariffPrefix}${octopusApi.productCode}-${octopusApi.regionCode}` +
    `/${octopusApi.path.standardUnitRates}`;

const uploadToS3 = async (fileContent: string) => {
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

const findPrice = (date: number, results: Result[]) => {
    return results.find((result) => {
        const from = Date.parse(result.valid_from);
        const to = Date.parse(result.valid_to);
        return from <= date && date <= to;
    })?.value_inc_vat;
}

const getDateString = (date: number) => {
    return new Date(date).toLocaleString('en-GB', {
        timeZone: "Europe/London",
        day: '2-digit',
        month: '2-digit'
    });
}

const getSingleFuelResult = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json() as StandardUnitRates;
    return data.results;
}

export const getPrices = async () => {
    const electricityPrices = await getSingleFuelResult(electricityUrl);
    const gasPrices = await getSingleFuelResult(gasUrl);

    const today = Date.now()
    const yesterday = today - 24 * 60 * 60 * 1000;
    const tomorrow = today + 24 * 60 * 60 * 1000;

    const prices: Prices = {
        prices: [
            {
                date: getDateString(yesterday),
                electricityPrice: findPrice(yesterday, electricityPrices)?.toFixed(2),
                gasPrice: findPrice(yesterday, gasPrices)?.toFixed(2),
            },
            {
                date: getDateString(today),
                electricityPrice: findPrice(today, electricityPrices)?.toFixed(2),
                gasPrice: findPrice(today, gasPrices)?.toFixed(2),
            }
        ],
        lastUpdateTime: new Date().toLocaleString('en-GB', {
            timeZone: 'Europe/London',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    const tomorrowElectricityPrice = findPrice(tomorrow, electricityPrices)?.toFixed(2);
    const tomorrowGasPrice = findPrice(tomorrow, gasPrices)?.toFixed(2);
    if (tomorrowElectricityPrice || tomorrowGasPrice) {
        prices.prices.push({
            date: getDateString(tomorrow),
            electricityPrice: tomorrowElectricityPrice,
            gasPrice: tomorrowGasPrice,
        });
    }

    return prices;
}

const generateHtml = (prices: Prices) => {
    const template = fs.readFileSync(templateLocation, {encoding: "utf8", flag: "r"});
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(prices);
}

export const handler = async (event: APIGatewayProxyEvent) => {
    console.info("handler started");
    const prices = await getPrices();
    console.info("prices generated");
    const htmlContent = generateHtml(prices);
    console.info("htmlContent = " + htmlContent);
    return await uploadToS3(htmlContent);
}
