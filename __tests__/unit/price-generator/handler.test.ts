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

describe("handler", () => {
    test("should upload generated price HTML to S3", async () => {
        mockGetPrices.mockResolvedValue(somePrices);
        mockGenerateHtml.mockReturnValue("some-html");

        await handler({} as APIGatewayProxyEvent);

        expect(mockGetPrices).toBeCalledTimes(1);
        expect(mockGenerateHtml).toBeCalledTimes(1);
        expect(mockGenerateHtml).toBeCalledWith(Region.London, somePrices, currentTime);
        expect(mockUploadToS3).toBeCalledTimes(1);
        expect(mockUploadToS3).toBeCalledWith("some-html");
    });
});