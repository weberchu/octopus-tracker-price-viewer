import { Product, Region } from "../../../src/price-generator/types";

const mockGetPrices = jest.fn();
const mockGenerateHtml = jest.fn();
const mockUploadToS3 = jest.fn();
jest.mock("../../../src/price-generator/price-generator", () => ({
    getPrices: mockGetPrices
}));
jest.mock("../../../src/price-generator/html-generator", () => ({
    generateHtml: mockGenerateHtml
}));
jest.mock("../../../src/price-generator/uploader", () => ({
    uploader: {
        uploadToS3: mockUploadToS3.mockImplementation(() => Promise.resolve())
    }
}));

import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../../src/price-generator/handler";

const somePrices = [
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
];

const currentTime = new Date('2023-07-20T12:34:56Z');

jest.useFakeTimers().setSystemTime(currentTime);

const mockPrices = (region: Region, product: Product) => {
    const prefix = region.code.charCodeAt(0) * 100 + product.name.charCodeAt(0);
    return [
        ...somePrices,
        {
            date: "12/07",
            electricityPrice: prefix + ".0",
            gasPrice: prefix + ".5",
        },
    ];
};
const mockHtmlContent = (region: Region, product: Product) => {
    return "some html content for " + region.name + " " + product.name;
}

describe("handler", () => {
    test("should upload generated price HTML to S3", async () => {
        mockGetPrices.mockImplementation((region: Region, product: Product) =>
            Promise.resolve(mockPrices(region, product)));
        mockGenerateHtml.mockImplementation(mockHtmlContent);

        await handler({} as APIGatewayProxyEvent);

        expect(mockGetPrices).toBeCalledTimes(Region.ALL.length * Product.ALL.length);
        for (const region of Region.ALL) {
            for (const product of Product.ALL) {
                expect(mockGetPrices).toHaveBeenCalledWith(region, product);
            }
        }

        expect(mockGenerateHtml).toBeCalledTimes(Region.ALL.length * Product.ALL.length);
        for (const region of Region.ALL) {
            for (const product of Product.ALL) {
                expect(mockGenerateHtml).toBeCalledWith(region, product, mockPrices(region, product), currentTime);
            }
        }

        const totalPageCount = Region.ALL.map(r => r.pageNames.length).reduce((p, c) => p + c);
        expect(mockUploadToS3).toBeCalledTimes(totalPageCount * (Product.ALL.length + 1));
        for (const region of Region.ALL) {
            for (const pageName of region.pageNames) {
                expect(mockUploadToS3).toBeCalledWith(mockHtmlContent(region, Product.November2022v1), pageName);
                for (const product of Product.ALL) {
                    expect(mockUploadToS3).toBeCalledWith(mockHtmlContent(region, product), product.code + "/" + pageName);
                }
            }
        }
    });
});