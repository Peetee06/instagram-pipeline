const fs = require('fs');
const path = require('path');
require('ag-psd/initialize-canvas');
const { readPsd, writePsd } = require('ag-psd');

async function applyText(inputFile, texts) {
  const inputBuffer = fs.readFileSync(inputFile);
  const psd = readPsd(inputBuffer);

  function applyTextToLayer(layer, id, content) {
    if (layer.id === id && layer.text) {
      console.log("Applying content: " + content);
      layer.text.text = content;
      return true;
    }

    if (layer.children) {
      for (const child of layer.children) {
        if (applyTextToLayer(child, id, content)) {
          return true;
        }
      }
    }

    return false;
  }

  texts.forEach(({ id, content }) => {
    applyTextToLayer(psd, id, content);
  });


  const outputPsd = writePsd(psd, { invalidateTextLayers: true });
  const outputFile = path.join(
    path.dirname(inputFile),
    'output',
    path.basename(inputFile)
  );
  fs.writeFileSync(outputFile, Buffer.from(outputPsd));

  console.log("Sending request to Model")

  return outputFile;

}

module.exports = applyText;
