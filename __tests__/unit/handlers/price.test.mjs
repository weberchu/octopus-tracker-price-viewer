import { jest } from '@jest/globals';

const electricityJson = jest.fn();
const gasJson = jest.fn();

jest.mock("node-fetch", () => {
    return (url) => {
        return Promise.resolve({
            json: url.contains("electricity-tariffs") ? electricityJson : gasJson
        })
    }
});

import { getPrices, handler } from '../../../src/handlers/price-generator.mjs';

describe('price handler', function () {
    beforeEach(() => {
        Date.now = jest.fn();
        electricityJson.mockReset();
        gasJson.mockReset();
    });

    it('should return yesterday, today and tomorrow prices', async () => {
        Date.now.mockReturnValue(1689789005220); // Jul 19 2023 18:50:05 GMT+0100
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
                electricityPrice: 18.333,
                gasPrice: 3.675,
            },
            {
                date: "19/07",
                electricityPrice: 17.199,
                gasPrice: 3.8535,
            },
            {
                date: "20/07",
                electricityPrice: 15.1045,
                gasPrice: 3.8115,
            }
        ]);
    });

    it('should handle single fuel availability', async () => {
        Date.now.mockReturnValue(1689789005220); // Jul 19 2023 18:50:05 GMT+0100
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
                electricityPrice: 18.333,
                gasPrice: 3.675,
            },
            {
                date: "19/07",
                electricityPrice: 17.199,
                gasPrice: 3.8535,
            },
            {
                date: "20/07",
                electricityPrice: null,
                gasPrice: 3.8115,
            }
        ]);
    });
});
