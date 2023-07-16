import AWS from 'aws-sdk';
const s3 = new AWS.S3();

const key = `price.html`;
const bucketName = 'octopus-tracker';

async function uploadToS3(fileContent) {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
    };

    try {
        const response = await s3.upload(params).promise();
        console.info('File uploaded successfully:', response.Location);
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

export const handler = async (event, context) => {
    console.info(JSON.stringify(event));

    const fileContent = 'Hello, S3!';
    return await uploadToS3(fileContent);
}
