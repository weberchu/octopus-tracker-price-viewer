// Import scheduledEventLoggerHandler function from price-generator.mjs
import { getPrices, handler } from '../../../src/handlers/price-generator.mjs';
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

describe('price', function () {
    Date.now = jest.fn();

    it('handler', async () => {
        Date.now.mockReturnValue(1689789005220); // Jul 19 2023 18:50:05 GMT+0100
        electricityJson.mockResolvedValue({
            count: 2,
            next: null,
            previous: null,
            results: [
                {
                    value_exc_vat: 16.29,
                    value_inc_vat: 17.1045,
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
                }, {
                    value_exc_vat: 3.67,
                    value_inc_vat: 3.8535,
                    valid_from: "2023-07-18T23:00:00Z",
                    valid_to: "2023-07-19T23:00:00Z",
                    payment_method: null
                }
            ]
        })

        const prices = await getPrices();

        expect(prices.prices).toEqual([
            {
                date: "19/07",
                electricityPrice: 17.199,
                gasPrice: 3.8535,
            },
            {
                date: "20/07",
                electricityPrice: 17.1045,
                gasPrice: 3.8115,
            }
        ]);
    });
});
