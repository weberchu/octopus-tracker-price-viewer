import { OctopusResult, OctopusStandardUnitRates } from "./types";
import fetch from "node-fetch";

export const getSingleFuel = async (url: string): Promise<OctopusResult[]> => {
    const response = await fetch(url);
    const data = (await response.json()) as OctopusStandardUnitRates;
    return data.results;
};
