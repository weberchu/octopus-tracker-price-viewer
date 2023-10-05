import { Price, Region } from "./types";
import fs from "fs";
import templateLocation from "../template/price.hbs";
import Handlebars from "handlebars";
import { toLastUpdateTime } from "./date-time-formatter";

type templateContext = {
    regionName: string,
    prices: Price[],
    lastUpdateTime: string,
}

export const generateHtml = (region: Region, prices: Price[], generationTimestamp: Date) => {
    const template = fs.readFileSync(templateLocation, {encoding: "utf8", flag: "r"});
    const compiledTemplate = Handlebars.compile(template);

    const context: templateContext = {
        regionName: "blah",
        prices,
        lastUpdateTime: toLastUpdateTime(generationTimestamp)
    }

    return compiledTemplate(context);
}