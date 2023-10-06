import { Region } from "../../../src/price-generator/types";

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
        uploadToS3: mockUploadToS3
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

const mockPrices = (region: Region) => {
    return [
        ...somePrices,
        {
            date: "12/07",
            electricityPrice: region.code.charCodeAt(0) + ".0",
            gasPrice: region.code.charCodeAt(0) + ".5",
        },
    ];
};
const mockHtmlContent = (region: Region) => {
    return "some html content for " + region.name;
}

describe("handler", () => {
    test("should upload generated price HTML to S3", async () => {
        mockGetPrices.mockImplementation(mockPrices);
        mockGenerateHtml.mockImplementation(mockHtmlContent);

        await handler({} as APIGatewayProxyEvent);

        expect(mockGetPrices).toBeCalledTimes(Region.ALL.length);
        for (const region of Region.ALL) {
            expect(mockGetPrices).toHaveBeenCalledWith(region);
        }
        expect(mockGenerateHtml).toBeCalledTimes(Region.ALL.length);
        for (const region of Region.ALL) {
            expect(mockGenerateHtml).toBeCalledWith(region, mockPrices(region), currentTime);
        }
        const totalPageCount = Region.ALL.map(r => r.pageNames.length).reduce((p, c) => p + c);
        expect(mockUploadToS3).toBeCalledTimes(totalPageCount);
        for (const region of Region.ALL) {
            for (const pageName of region.pageNames) {
                expect(mockUploadToS3).toBeCalledWith(mockHtmlContent(region), pageName);
            }
        }
    });
});