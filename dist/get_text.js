export const getText = async  (page) => {
    return await page.$eval('*', (el) => el.innerText);
}