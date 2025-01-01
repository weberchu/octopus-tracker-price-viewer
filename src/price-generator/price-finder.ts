import { OctopusResult } from "./types";

export const findPrice = (date: Date, results: OctopusResult[]) => {
    const dateEpoch = date.getTime();
    return results.find((result) => {
        const from = Date.parse(result.valid_from);
        const to = Date.parse(result.valid_to);
        return from <= dateEpoch && dateEpoch <= to;
    })?.value_inc_vat;
};
