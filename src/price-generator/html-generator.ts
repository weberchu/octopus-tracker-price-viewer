import { Price, Product, Region } from "./types";
import fs from "fs";
import templateLocation from "../template/price.hbs";
import Handlebars from "handlebars";
import { toLastUpdateTime } from "./date-time-formatter";

type PriceLink = {
    name: string;
    link: string;
};

type TemplateContext = {
    regionName: string;
    productName: string;
    prices: Price[];
    lastUpdateTime: string;
    otherRegions: PriceLink[];
    otherProducts: PriceLink[];
};

function generateRegionLink(region: Region, product: Product) {
    return generateLink(region.name, region, product);
}

function generateProductLink(region: Region, product: Product) {
    return generateLink(product.name, region, product);
}

function generateLink(name: string, region: Region, product: Product) {
    return {
        name: name,
        link: "../" + product.code + "/" + region.pageNames[0],
    };
}

export const generateHtml = (region: Region, product: Product, prices: Price[], generationTimestamp: Date) => {
    const template = fs.readFileSync(templateLocation, {
        encoding: "utf8",
        flag: "r",
    });
    const compiledTemplate = Handlebars.compile(template);
    const otherRegionLinks = Region.ALL.filter((r) => r !== region).map((r) => generateRegionLink(r, product));
    const otherProductLinks = Product.ALL.filter((p) => p !== product).map((p) => generateProductLink(region, p));

    const context: TemplateContext = {
        regionName: region.name,
        productName: product.name,
        prices,
        lastUpdateTime: toLastUpdateTime(generationTimestamp),
        otherRegions: otherRegionLinks,
        otherProducts: otherProductLinks,
    };

    return compiledTemplate(context);
};
