const electricityJson = jest.fn();
const gasJson = jest.fn();
const mockDateNow = jest.fn();

jest.mock("node-fetch", () => {
    return (url: string) => {
        return Promise.resolve({
            json: url.includes("electricity-tariffs") ? electricityJson : gasJson
        })
    }
});

import { getPrices } from '../../../src/handlers/price-generator';

describe('price handler', function () {
    beforeEach(() => {
        // @ts-ignore
        Date.now = mockDateNow;
        electricityJson.mockReset();
        gasJson.mockReset();
    });

    it('should return yesterday, today and tomorrow prices', async () => {
        mockDateNow.mockReturnValue(1689789005220); // Jul 19 2023 18:50:05 GMT+0100
        electricityJson.mockResolvedValue({
            count: 2,
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

        const prices = await getPrices();

        expect(prices.prices).toEqual([
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
        mockDateNow.mockReturnValue(1689789005220); // Jul 19 2023 18:50:05 GMT+0100
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

        const prices = await getPrices();

        expect(prices.prices).toEqual([
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
