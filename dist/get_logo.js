import { getImagesInfo } from "../utils/images_utils.js";

export const getLogo = async (page, protocol, hostname) => {
    const ogImageElement = await page.$('head > meta[property="og:image"]');

    if (ogImageElement) {
        const ogImageContent = await ogImageElement.getProperty('content');
        const ogImageUrl = await ogImageContent.jsonValue();
        const imageInfo = await getImagesInfo([ogImageUrl], protocol, hostname);

        return imageInfo.length > 0 ? imageInfo[0].source : null;
    }

    return null;
}