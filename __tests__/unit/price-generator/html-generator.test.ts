import { generateHtml } from "../../../src/price-generator/html-generator";
import { Region } from "../../../src/price-generator/types";

describe("html-generator", () => {
    describe("generateHtml", () => {
        test("should match snapshot", () => {
            const prices = [
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
            ];
            const html = generateHtml(Region.WestMidlands, prices, new Date('2023-11-20T12:34:56Z'));

            expect(html).toMatchSnapshot();
        });
    });
});