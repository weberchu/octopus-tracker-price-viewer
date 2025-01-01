import { generateHtml } from "./html-generator";
import { uploader } from "./uploader";
import { getPrices } from "./price-generator";
import { DEFAULT_PRODUCT, Product, Region } from "./types";

export const handler = async () => {
    console.info("handler started");
    const generationTimeStamp = new Date();

    for (const product of Product.ALL) {
        // handle all regions within a product in parallel
        await Promise.all(
            Region.ALL.map((region) =>
                Promise.resolve(region)
                    .then((region) => getPrices(region, product))
                    .then(async (prices) => {
                        console.info("[" + product.code + "-" + region.name + "] prices generated");

                        const htmlContent = generateHtml(region, product, prices, generationTimeStamp);
                        console.info("[" + product.code + "-" + region.name + "] htmlContent generated");

                        for (const pageName of region.pageNames) {
                            const filenames = [];
                            if (product == DEFAULT_PRODUCT) {
                                filenames.push(pageName); // backwards compatibility with url without product code
                            }
                            filenames.push(product.code + "/" + pageName);
                            for (const filename of filenames) {
                                await uploader.uploadToS3(htmlContent, filename);
                                console.info("[" + product.code + "-" + region.name + "] uploaded to " + filename);
                            }
                        }
                    })
            )
        );
    }
};
