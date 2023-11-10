import https from "https";
import fs from 'fs/promises';
import path from 'path';

export const storeImage = (imageUrl, folder, source, fileName) => {
    const folderPath = path.join(source, folder);
    const filePath = path.join(folderPath, fileName);

    https.get(imageUrl, (response) => {
        if (response.statusCode === 200) {
            const content = [];

            response.on('data', (chunk) => {
                content.push(chunk);
            });

            response.on('end', async () => {
                // Create the folder (if it doesn't exist) and save the image
                await fs.mkdir(folderPath, { recursive: true });
                await fs.writeFile(filePath, Buffer.concat(content));
            });
        }
    })
};

export const saveText = async (content, folder, source, fileName) => {
    if (!content) {
        return;
    }

    const folderPath = path.join(source, folder);
    const filePath = path.join(folderPath, fileName);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
};

export const saveMainColorSVG = async (color, folder, source) => {
    if (!color) {
        return;
    }

    const folderPath = path.join(source, folder);
    const filePath = path.join(folderPath, 'main_color.svg');
    const svgContent = createSVGWithFillColor(color);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(filePath, svgContent, 'utf-8');
};

// Helper function to create an SVG with a specified fill color
const createSVGWithFillColor = (fillColor) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    <rect width="100" height="100" fill="${fillColor}" />
  </svg>`;
};