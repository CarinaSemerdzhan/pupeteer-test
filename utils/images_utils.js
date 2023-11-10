import https from "https";
import imageSize from 'image-size';
import { checkUrl } from "./general_utils.js";

export const getImagesInfo = (imageURLs, protocol, href) => {
    const validURLs = imageURLs.filter((url) => {
        console.log(url)
        return !url.startsWith('https://track.adform.net/Serving/TrackPoint/') &&
            typeof url === 'string' &&
            url !== 'url("")' &&
            url !== 'b9a44284919ca32cf1fd.svg' &&
            url !== 'https://praemienrechner.atupri.ch/app/images/homepage-hero-compressor.jpg'
    });
    const checkedUrl = validURLs.map(url => checkUrl(url, protocol, href));

    console.log(checkedUrl)

    const promises = checkedUrl.map((imageURL) => {
        return new Promise((resolve, reject) => {
            if (imageURL.startsWith('http')) {
                const urlObj = new URL(imageURL);
                // Set the search property (query parameters) to an empty string
                urlObj.search = '';
                // Return the updated URL as a string
                urlObj.toString();

                // Handle URL
                https.get(urlObj, (response) => {
                    if (response.statusCode === 200) {
                        const chunks = [];

                        response.on('data', (chunk) => {
                            chunks.push(chunk);
                        });

                        response.on('end', () => {
                            // Combine the received chunks into a single buffer
                            const imageBuffer = Buffer.concat(chunks);

                            // Check if the buffer is empty
                            if (imageBuffer.length !== 0) {
                                processImage(imageBuffer, imageURL);
                            }
                        });
                    } else {
                        resolve(null)
                    }
                });
            } else if (imageURL.startsWith('data:image')) {
                // Handle base64-encoded image
                const base64Data = imageURL.split(',')[1];
                if (base64Data) {
                    // processImage(Buffer.from(base64Data, 'base64'), imageURL);
                    resolve(null)
                }
                else {
                    resolve(null)
                }
            } else {
                resolve(null)
            }

            function processImage (buffer, source) {
                console.log('source: ', source);
                const dimensions = imageSize(buffer);
                const { width, height } = dimensions;

                // Determine if the image itself has a transparent background
                const hasTransparentBackground = checkTransparentBackground(buffer, width, height);

                resolve({ ...dimensions, hasTransparentBackground, source });
            }
        });
    });

    return Promise.all(promises);
};

export const checkTransparentBackground = (buffer, width, height) => {
    /* To determine if the image itself has a transparent background,
    we can examine the alpha value of the pixels along the edges of the image.
    If any edge pixel has an alpha value less than 255 (not fully opaque),
    it indicates that the image may have a transparent background. */

    const edgeAlphaValues = [];

    // Top edge
    for (let i = 3; i < width * 4; i += 4) {
        edgeAlphaValues.push(buffer[i]);
    }

    // Bottom edge
    for (let i = (height - 1) * width * 4 + 3; i < height * width * 4; i += 4) {
        edgeAlphaValues.push(buffer[i]);
    }

    // Left edge
    for (let i = width * 4; i < height * width * 4; i += width * 4) {
        edgeAlphaValues.push(buffer[i]);
    }

    // Right edge
    for (let i = (width - 1) * 4; i < height * width * 4; i += width * 4) {
        edgeAlphaValues.push(buffer[i]);
    }

    // Check if any edge pixel has an alpha value less than 255 (not fully opaque)
    return edgeAlphaValues.some((alpha) => alpha < 255);
}
