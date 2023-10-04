import { OctopusResult } from "../../../src/price-generator/types";
import { findPrice } from "../../../src/price-generator/price-finder";

describe("price-finder", () => {
    const results: OctopusResult[] = [
        {
            value_exc_vat: 1,
            value_inc_vat: 2,
            valid_from: "2023-07-19T23:00:00Z",
            valid_to: "2023-07-20T23:00:00Z",
        },
        {
            value_exc_vat: 3,
            value_inc_vat: 4,
            valid_from: "2023-07-20T23:00:00Z",
            valid_to: "2023-07-21T23:00:00Z",
        },
        {
            value_exc_vat: 5,
            value_inc_vat: 6,
            valid_from: "2023-07-21T23:00:00Z",
            valid_to: "2023-07-22T23:00:00Z",
        }
    ]

    describe("findPrice", () => {
        test("should find VAT price for the given date", () => {
            expect(findPrice(new Date('2023-07-20T10:00:00Z'), results))
                .toEqual(2);
            expect(findPrice(new Date('2023-07-21T10:00:00Z'), results))
                .toEqual(4);
            expect(findPrice(new Date('2023-07-21T23:00:01Z'), results))
                .toEqual(6);
        });

        test("should return undefined if date is not found", () => {
            expect(findPrice(new Date('2023-07-19T22:59:59Z'), results))
                .toBeUndefined();
            expect(findPrice(new Date('2023-07-22T23:00:01Z'), results))
                .toBeUndefined();
            expect(findPrice(new Date('2023-07-23T10:00:00Z'), results))
                .toBeUndefined();
        });
    });
});