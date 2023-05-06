const fs = require('fs');
require('ag-psd/initialize-canvas');
const { readPsd } = require('ag-psd');

async function extractText(filePath) {
    const buffer = fs.readFileSync(filePath);
    const psd = readPsd(buffer);
    const extractedText = [];

    function processLayers(layers) {
        layers.forEach((layer) => {
            if (layer.children) {
                processLayers(layer.children);
            } else if (Object.hasOwn(layer, "text")) {
                extractedText.push({
                    id: layer.id,
                    content: layer.text.text,
                });
            }
        });
    }

    psd.children.forEach((layer) => {
        if (layer.children) {
            processLayers(layer.children);
        }
    });
    return extractedText;
}

module.exports = extractText;
