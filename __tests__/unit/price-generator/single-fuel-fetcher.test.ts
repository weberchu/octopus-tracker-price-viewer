const mockFetch = jest.fn();
const mockFetchJson = jest.fn();

jest.mock("node-fetch", () => {
    return mockFetch.mockResolvedValue({
        json: mockFetchJson
    });
});

import { getSingleFuel } from "../../../src/price-generator/single-fuel-fetcher";
import { OctopusStandardUnitRates } from "../../../src/price-generator/types";

describe("single-fuel-fetcher", () => {
    test("should return results", async () => {
        const responseObject: OctopusStandardUnitRates = {
            count: 2,
            results: [
                {
                    value_exc_vat: 1,
                    value_inc_vat: 2,
                    valid_from: "from-date-1",
                    valid_to: "to-date-1",
                },
                {
                    value_exc_vat: 3,
                    value_inc_vat: 4,
                    valid_from: "from-date-2",
                    valid_to: "to-date-2",
                }
            ]
        };

        mockFetchJson.mockResolvedValue(responseObject);

        const results = await getSingleFuel("some-url");

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith("some-url");
        expect(results[0]).toEqual(responseObject.results[0]);
        expect(results[1]).toEqual(responseObject.results[1]);
    });
});