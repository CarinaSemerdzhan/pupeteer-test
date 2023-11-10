import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import { getImages } from "./get_images.js";
import { getMainColor, getMainFont } from "./get_styles.js";
import { getLogo } from "./get_logo.js";
import { getText } from "./get_text.js";
import { saveMainColorSVG, saveText, storeImage } from "../utils/storage_utils.js";
import path from "path";

export const scrapper = async (url) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set a custom user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36');

    // Navigate the page to a URL
    const response = await page.goto(url, {
        // timeout: 30000,
        waitUntil: 'networkidle0'
    });

    // Set screen size
    // await page.setViewport({width: 1080, height: 1024});

    // Get the current protocol and URL (href) of the page
    const currentUrl = new URL(page.url());

    const folderPath = path.join('output', currentUrl.hostname);

    await fs.mkdir(folderPath, { recursive: true });

    if (response.status() === 403) {
        await saveText('The page is blocked.', 'text', folderPath, 'blocked.txt');
    }

    const title = await page.title();
    await saveText(title, 'text', folderPath, 'title.txt');

    await page.screenshot({ path: `${folderPath}/screenshot.png`});

    const text = await getText(page);
    await saveText(text, 'text', folderPath, 'texts.txt');

    const logo = await getLogo(page, currentUrl.protocol, currentUrl.hostname);
    if (logo) {
        await storeImage(logo, 'logos', folderPath, path.basename(new URL(logo).pathname));
    }

    const images = await getImages(page, currentUrl.protocol, currentUrl.hostname);
    for (let i = 0; i < images.length; i++) {
        console.log(images[i]);
        if (images[i]) {
            await storeImage(images[i].source, 'images', folderPath, path.basename(new URL(images[i].source).pathname));
        }
    }

    const mainFont = await getMainFont(page);
    await saveText(mainFont, 'text', folderPath, 'main_font.txt');

    const mainColor = await getMainColor(page);
    await saveMainColorSVG(mainColor, 'main_color', folderPath);

    await browser.close();
}