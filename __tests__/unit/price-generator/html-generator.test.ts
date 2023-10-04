import { generateHtml } from "../../../src/price-generator/html-generator";
import { Prices } from "../../../src/price-generator/types";

describe("html-generator", () => {
    describe("generateHtml", () => {
        test("should match snapshot", () => {
            const prices: Prices = {
                prices: [
                    {
                        date: "10/07",
                        electricityPrice: "1.0",
                        gasPrice: "2.0",
                    },
                    {
                        date: "11/07",
                        electricityPrice: "3.0",
                        gasPrice: "4.0",
                    },
                    {
                        date: "12/07",
                        electricityPrice: "5.0",
                    },
                ],
                lastUpdateTime: "12:34:56"
            }
            const html = generateHtml(prices);

            expect(html).toMatchSnapshot();
        });
    });
});