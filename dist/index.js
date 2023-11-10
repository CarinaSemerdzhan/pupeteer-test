import async from 'async';
import { web_sites } from "./web_sites.js";
import { scrapper } from "./scrapper.js";

// Set the concurrency limit
const concurrencyLimit = 2; // Adjust this value as needed

// Create an async queue with the concurrency limit
// const queue = async.queue((url, callback) => {
//     scrapper(url).then(() => callback());
// }, concurrencyLimit);
//
// // Push the URLs into the queue
// web_sites.forEach((url) => {
//     queue.push(url, (err) => {
//         if (err) {
//             console.error(`Error scraping ${url}: ${err}`);
//         }
//     });
// });
//
// // When all tasks are done, perform any cleanup or finalization
// queue.drain(() => {
//     console.log('All scraping tasks completed.');
// });

await scrapper(web_sites[3]);