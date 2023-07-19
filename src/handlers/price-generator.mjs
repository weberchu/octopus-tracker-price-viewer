import AWS from 'aws-sdk';
import fs from 'fs';
import Handlebars from "handlebars";
import fetch from 'node-fetch';

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

const findPrice = (date, results) => {
    return results.find((result) => {
        const from = Date.parse(result.valid_from);
        const to = Date.parse(result.valid_to);
        return from <= date && date <= to;
    }).value_inc_vat;
}

const getDateString = (date) => {
    return new Date(date).toLocaleString('en-GB', {
        timeZone: "Europe/London",
        day: '2-digit',
        month: '2-digit'
    });
}

const getSingleFuelPrice = async (url) => {
    const today = Date.now()
    const tomorrow = today + 24 * 60 * 60 * 1000;

    const response = await fetch(url);
    const data = await response.json();
    const todayPrice = findPrice(today, data.results);
    const tomorrowPrice = findPrice(tomorrow, data.results);

    return {
        today: {
            date: getDateString(today),
            price: todayPrice,
        },
        tomorrow: {
            date: getDateString(tomorrow),
            price: tomorrowPrice,
        }
    }
}

export const getPrices = async () => {
    const electricityPrice = await getSingleFuelPrice(electricityUrl);
    const gasPrice = await getSingleFuelPrice(gasUrl);

    return {
        prices: [
            {
                date: electricityPrice.today.date,
                electricityPrice: electricityPrice.today.price,
                gasPrice: gasPrice.today.price,
            },
            {
                date: electricityPrice.tomorrow.date,
                electricityPrice: electricityPrice.tomorrow.price,
                gasPrice: gasPrice.tomorrow.price,
            }
        ],
        lastUpdateTime: new Date().toLocaleString('en-GB', {timeZone: 'Europe/London'})
    };
}

const generateHtml = (prices) => {
    const template = fs.readFileSync("./src/template/price.hbs", {encoding: "utf8", flag: "r"});
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(prices);
}

export const handler = async (event, context) => {
    const prices = await getPrices();
    const htmlContent = generateHtml(prices);
    console.info("htmlContent = " + htmlContent);
    return await uploadToS3(htmlContent);
}
