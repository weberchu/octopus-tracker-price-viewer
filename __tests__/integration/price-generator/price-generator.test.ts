import { Product, Region } from "../../../src/price-generator/types";

const electricityJson = jest.fn();
const gasJson = jest.fn();
const electricityUrl = "https://api.octopus.energy/some-electricity-url";
const gasUrl = "https://api.octopus.energy/some-gas-url";
const mockElectricityUrl = jest.fn();
const mockGasUrl = jest.fn();

jest.mock("../../../src/price-generator/url-generator", () => ({
    electricityUrl: mockElectricityUrl.mockReturnValue(electricityUrl),
    gasUrl: mockGasUrl.mockReturnValue(gasUrl),
}));
jest.mock("node-fetch", () => {
    return (url: string) => {
        return Promise.resolve({
            json: url === electricityUrl ? electricityJson :
                url === gasUrl ? gasJson : jest.fn()
        })
    }
});

import { getPrices } from '../../../src/price-generator/price-generator';

describe('price-generator', function () {
    describe("getPrices", () => {

        beforeEach(() => {
            electricityJson.mockReset();
            gasJson.mockReset();
        });

        it('should return yesterday, today and tomorrow prices', async () => {
            jest.useFakeTimers().setSystemTime(1689789005220); // Jul 19 2023 18:50:05 GMT+0100
            electricityJson.mockResolvedValue({
                count: 3,
                next: null,
                previous: null,
                results: [
                    {
                        value_exc_vat: 16.29,
                        value_inc_vat: 15.1045,
                        valid_from: "2023-07-19T23:00:00Z",
                        valid_to: "2023-07-20T23:00:00Z",
                        payment_method: null
                    },
                    {
                        value_exc_vat: 16.38,
                        value_inc_vat: 17.199,
                        valid_from: "2023-07-18T23:00:00Z",
                        valid_to: "2023-07-19T23:00:00Z",
                        payment_method: null
                    },
                    {
                        value_exc_vat: 17.46,
                        value_inc_vat: 18.333,
                        valid_from: "2023-07-17T23:00:00Z",
                        valid_to: "2023-07-18T23:00:00Z",
                        payment_method: null
                    }
                ]
            });
            gasJson.mockResolvedValue({
                count: 3,
                next: null,
                previous: null,
                results: [
                    {
                        value_exc_vat: 3.63,
                        value_inc_vat: 3.8115,
                        valid_from: "2023-07-19T23:00:00Z",
                        valid_to: "2023-07-20T23:00:00Z",
                        payment_method: null
                    },
                    {
                        value_exc_vat: 3.67,
                        value_inc_vat: 3.8535,
                        valid_from: "2023-07-18T23:00:00Z",
                        valid_to: "2023-07-19T23:00:00Z",
                        payment_method: null
                    },
                    {
                        value_exc_vat: 3.5,
                        value_inc_vat: 3.675,
                        valid_from: "2023-07-17T23:00:00Z",
                        valid_to: "2023-07-18T23:00:00Z",
                        payment_method: null
                    },
                ]
            })

            const prices = await getPrices(Region.London, Product.December2023v1);

            expect(mockElectricityUrl).toHaveBeenCalledWith(Region.London, Product.December2023v1);
            expect(mockGasUrl).toHaveBeenCalledWith(Region.London, Product.December2023v1);
            expect(prices).toEqual([
                {
                    date: "18/07",
                    electricityPrice: "18.33",
                    gasPrice: "3.67",
                },
                {
                    date: "19/07",
                    electricityPrice: "17.20",
                    gasPrice: "3.85",
                },
                {
                    date: "20/07",
                    electricityPrice: "15.10",
                    gasPrice: "3.81",
                }
            ]);
        });

        it('should handle single fuel availability', async () => {
            jest.useFakeTimers().setSystemTime(1689789005220); // Jul 19 2023 18:50:05 GMT+0100
            electricityJson.mockResolvedValue({
                count: 2,
                next: null,
                previous: null,
                results: [
                    {
                        value_exc_vat: 16.38,
                        value_inc_vat: 17.199,
                        valid_from: "2023-07-18T23:00:00Z",
                        valid_to: "2023-07-19T23:00:00Z",
                        payment_method: null
                    },
                    {
                        value_exc_vat: 17.46,
                        value_inc_vat: 18.333,
                        valid_from: "2023-07-17T23:00:00Z",
                        valid_to: "2023-07-18T23:00:00Z",
                        payment_method: null
                    }
                ]
            });
            gasJson.mockResolvedValue({
                count: 2,
                next: null,
                previous: null,
                results: [
                    {
                        value_exc_vat: 3.63,
                        value_inc_vat: 3.8115,
                        valid_from: "2023-07-19T23:00:00Z",
                        valid_to: "2023-07-20T23:00:00Z",
                        payment_method: null
                    },
                    {
                        value_exc_vat: 3.67,
                        value_inc_vat: 3.8535,
                        valid_from: "2023-07-18T23:00:00Z",
                        valid_to: "2023-07-19T23:00:00Z",
                        payment_method: null
                    },
                    {
                        value_exc_vat: 3.5,
                        value_inc_vat: 3.675,
                        valid_from: "2023-07-17T23:00:00Z",
                        valid_to: "2023-07-18T23:00:00Z",
                        payment_method: null
                    },
                ]
            })

            const prices = await getPrices(Region.SouthEasternEngland, Product.December2023v1);

            expect(mockElectricityUrl).toHaveBeenCalledWith(Region.SouthEasternEngland, Product.December2023v1);
            expect(mockGasUrl).toHaveBeenCalledWith(Region.SouthEasternEngland, Product.December2023v1);
            expect(prices).toEqual([
                {
                    date: "18/07",
                    electricityPrice: "18.33",
                    gasPrice: "3.67",
                },
                {
                    date: "19/07",
                    electricityPrice: "17.20",
                    gasPrice: "3.85",
                },
                {
                    date: "20/07",
                    electricityPrice: undefined,
                    gasPrice: "3.81",
                }
            ]);
        });
    });
});
