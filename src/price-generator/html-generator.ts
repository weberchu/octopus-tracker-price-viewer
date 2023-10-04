import { Prices } from "./types";
import fs from "fs";
import templateLocation from "../template/price.hbs";
import Handlebars from "handlebars";

export const generateHtml = (prices: Prices) => {
    const template = fs.readFileSync(templateLocation, {encoding: "utf8", flag: "r"});
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(prices);
}