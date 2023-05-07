const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");
const { response } = require("express");
dotenv.config({ path: ".env.local" });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function translateText(textArray, targetLanguage) {
  const inputJson = JSON.stringify(textArray);

  console.log("Translating to " + targetLanguage);
  console.log("Sending request to Model.");

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Act as a translator. Do the following steps with the json string that I will give you:
        1. Understand what the text is about. It is written for use on social media.
        2. Translate the "content" texts to ${targetLanguage} in a friendly, informal tone.
        Do not translate english phrases if they are commonly known by internet users speaking the target language.
        3. Return the same JSON string with the changed values from the previous steps.
        Here is the text to translate: ${inputJson}`,
      },
    ],
    temperature: 0,
  });

  console.log("Received response from Model.");

  const translatedJson = result.data.choices[0].message.content.trim();

  console.log("Parsing JSON.");

  let translatedText;
  try {
    translatedText = JSON.parse(translatedJson);
  } catch (error) {
    console.error(error);
    console.log(translatedJson);
    throw new Error("Error parsing JSON.");
  }

  return translatedText;
}

module.exports = translateText;
