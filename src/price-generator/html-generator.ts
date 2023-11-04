import { Price, Region } from "./types";
import fs from "fs";
import templateLocation from "../template/price.hbs";
import Handlebars from "handlebars";
import { toLastUpdateTime } from "./date-time-formatter";

type RegionLink = {
    regionName: string,
    link: string,
}

type templateContext = {
    regionName: string,
    prices: Price[],
    lastUpdateTime: string,
    otherRegions: RegionLink[]
}

export const generateHtml = (region: Region, prices: Price[], generationTimestamp: Date) => {
    const template = fs.readFileSync(templateLocation, {encoding: "utf8", flag: "r"});
    const compiledTemplate = Handlebars.compile(template);
    const otherRegionLinks =
        Region.ALL
            .filter(r => r !== region)
            .map(r => ({
                regionName: r.name,
                link: "./" + r.pageNames[0]
            }));

    const context: templateContext = {
        regionName: region.name,
        prices,
        lastUpdateTime: toLastUpdateTime(generationTimestamp),
        otherRegions: otherRegionLinks
    }

    return compiledTemplate(context);
}