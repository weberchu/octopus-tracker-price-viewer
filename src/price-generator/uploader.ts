import AWS from "aws-sdk";

const bucketName = "octopus-tracker";

class Uploader {
    private s3 = new AWS.S3();

    public uploadToS3 = async (fileContent: string, fileName: string) => {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileContent,
            CacheControl: "max-age=10",
            ContentType: "text/html",
        };

        try {
            const response = await this.s3.upload(params).promise();
            console.info("File uploaded successfully:", response.Location);
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    };
}

export const uploader = new Uploader();
