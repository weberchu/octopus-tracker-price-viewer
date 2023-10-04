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
import { Prices } from "../../../src/price-generator/types";
import { handler } from "../../../src/price-generator/handler";

const somePrices: Prices = {
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
    ],
    lastUpdateTime: "12:34:56"
}

describe("handler", () => {
    test("should upload generated price HTML to S3", async () => {
        mockGetPrices.mockResolvedValue(somePrices);
        mockGenerateHtml.mockReturnValue("some-html");

        await handler({} as APIGatewayProxyEvent);

        expect(mockGetPrices).toBeCalledTimes(1);
        expect(mockGenerateHtml).toBeCalledTimes(1);
        expect(mockGenerateHtml).toBeCalledWith(somePrices);
        expect(mockUploadToS3).toBeCalledTimes(1);
        expect(mockUploadToS3).toBeCalledWith("some-html");
    });
});