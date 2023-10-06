const mockUploadPromise = jest.fn();
const mockUpload = jest.fn().mockReturnValue({
    promise: mockUploadPromise
});
jest.mock("aws-sdk", () => ({
    S3: jest.fn().mockImplementation(() => {
        return {
            upload: mockUpload
        }
    })
}));

import { uploader } from "../../../src/price-generator/uploader";

describe("Uploader", () => {
    describe("uploadToS3", () => {
        test("should upload to S3", async () => {
            mockUploadPromise.mockResolvedValue({
                Location: "some-s3-location"
            });

            await uploader.uploadToS3("some-content", "some-place.html");

            expect(mockUpload).toHaveBeenCalledTimes(1);
            expect(mockUpload).toHaveBeenCalledWith({
                Bucket: "octopus-tracker",
                Key: "some-place.html",
                Body: "some-content",
                CacheControl: "max-age=10",
                ContentType: "text/html"
            });
        });

        test("should throw error when upload fails", async () => {
            mockUploadPromise.mockRejectedValue("some-error");
            await expect(uploader.uploadToS3("some-content", "some-place.html")).rejects.toBe("some-error");
        });
    });
});