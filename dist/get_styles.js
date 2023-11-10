import { countOccurrence } from "../utils/general_utils.js";

export const getMainFont = async  (page) => {
    const data = await page.evaluate(() => {
        const elements = document.body.getElementsByTagName("*");

        return [...elements].map(element => {
            element.focus();
            return window.getComputedStyle(element).getPropertyValue("font-family");
        });
    });

    return countOccurrence(data);
}

export const getMainColor = async  (page) => {
    const data = await page.evaluate(() => {
        const elements = document.body.getElementsByTagName("*");

        return [...elements].map(element => {
            element.focus();
            return window.getComputedStyle(element).getPropertyValue("color");
        });
    });

    return countOccurrence(data);
}