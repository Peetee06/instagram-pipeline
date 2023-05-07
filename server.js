const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const extractText = require("./extractText");
const translateText = require("./translateText");
const applyText = require("./applyText");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/api/upload", upload.single("psd"), async (req, res) => {
  if (req.file) {
    try {
      // Extract text from the uploaded PSD file
      console.log("Extracting text.");
      const extractedText = await extractText(req.file.path);

      // Translate the extracted text to the selected languages
      const language = req.body.language;
      const translatedText = await translateText(extractedText, language);

      // Apply the translated text to copies of the original PSD file
      const outputFile = await applyText(req.file.path, translatedText);

      // Read the output file as a buffer
      const outputBuffer = fs.readFileSync(outputFile);

      // Send a response with the generated file information
      console.log("Sending response.");
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", "attachment; filename=output.psd");
      res.status(200).send(outputBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing file" });
    }
  } else {
    // No file provided
    res.status(400).json({ message: "No file provided" });
  }
});
