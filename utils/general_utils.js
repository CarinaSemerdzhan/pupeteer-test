import url from 'url';
export const merge = (a, b, predicate = (a, b) => a === b) => {
    const c = [...a]; // copy to avoid side effects
    // add all items from B to copy C if they're not already present
    b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
    return c;
}

export const countOccurrence = (occurrences) => {
    const counts = {};
    let mostCommon = null;
    let maxCount = 0;

    for (const occurrence of occurrences) {
        counts[occurrence] = (counts[occurrence] || 0) + 1;
    }

    for (const count in counts) {
        if (counts[count] > maxCount) {
            mostCommon = count;
            maxCount = counts[count];
        }
    }

    return mostCommon;
}

export const checkUrl = (src, protocol, href) => {
    const isAbsoluteURL = (src) => {
        const parsedUrl = url.parse(src);
        return parsedUrl.protocol === 'http:' ||
            parsedUrl.protocol === 'https:' ||
            parsedUrl.href.startsWith('data:image');
    }
    return isAbsoluteURL(src) ? src : `${protocol}//${href}/${src}`;
}
