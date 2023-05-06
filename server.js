const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const express = require('express');
const path = require('path');

const extractText = require('./extractText');
const translateText = require('./translateText');
const applyText = require('./applyText');



const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/api/upload', upload.single('psd'), async (req, res) => {
    if (req.file) {
        try {
            // Extract text from the uploaded PSD file
            console.log("Extracting text.");
            const extractedText = await extractText(req.file.path);

            // Translate the extracted text to the selected languages
            console.log("Translating text.");
            const translatedText = await translateText(extractedText, "en");

            // Apply the translated text to copies of the original PSD file
            console.log("Applying text.");
            let outputFile;
            (async () => {
                try {
                  outputFile = await applyText(req.file.path, translatedText);
                  console.log('PSD and JPEG files saved successfully.');
                } catch (err) {
                  console.error('Error updating PSD file:', err);
                }
            })();
            console.log("Done.");

            // Send a response with the generated file information
            res.status(200).json({ message: 'File processed successfully', files: outputFile });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing file' });
        }
    } else {
        // No file provided
        res.status(400).json({ message: 'No file provided' });
    }
});
