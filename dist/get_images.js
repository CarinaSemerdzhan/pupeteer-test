import { checkUrl, merge } from "../utils/general_utils.js";
import { getImagesInfo } from "../utils/images_utils.js";

export const getImages = async (page, protocol, href) => {
    const imgURLs = await extractByImgTag(page)
    const styleURLs = await extractByStyleAttr(page);
    // const stylesheetURLs = await extractByStylesheet(page, protocol, href);
    const imagesInfos = await getImagesInfo(merge(imgURLs, styleURLs), protocol, href);

    return imagesInfos.filter(info => info && info.width >= 994 && info.height >= 600);
    // return imagesInfos;
}

// Extract images from <img> tags
const extractByImgTag = async (page) => {
    return await page.$$eval('img', (images) =>
        images.map((img) => img.getAttribute('src'))
    );
}

// Extract background-image URLs from style attributes
const extractByStyleAttr = async (page) => {
    return await page.$$eval('[style*="background-image"]', (elements) =>
        elements.map((el) => {
            const style = getComputedStyle(el);
            return style.backgroundImage.replace(/url\(['"]?([^'")]+)['"]?\)/, '$1');
        })
    );
}

// Extract background-image URLs from stylesheet files
const extractByStylesheet = async (page, protocol, href) => {
    const stylesheetLinks = await page.$$eval('link[rel="stylesheet"]', (stylesheets) =>
        stylesheets.map((stylesheet) => stylesheet.getAttribute('href'))
    );
    const imageURLs = [];

    for (const stylesheetLink of stylesheetLinks) {
        const stylesheetUrl = checkUrl(stylesheetLink, protocol, href);

        const stylesheetContent = await page.evaluate(async (stylesheetUrl) => {
            const response = await fetch(stylesheetUrl);
            return response.text();
        }, stylesheetUrl);

        const backgroundImageURLs = stylesheetContent.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\);/g);

        if (backgroundImageURLs) {
            for (const imageURL of backgroundImageURLs) {
                const urlMatch = imageURL.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (urlMatch) {
                    imageURLs.push(urlMatch[1]);
                }
            }
        }
    }

    return imageURLs;
}
