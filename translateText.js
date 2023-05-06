const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');
const { response } = require("express");
dotenv.config({ path: '.env.local' });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

async function translateText(textArray, targetLanguage) {
    const inputJson = JSON.stringify(textArray);

    console.log("Sending request to Model.");

    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Translate the following English texts to ${targetLanguage}. Return nothing but the same JSON with the "content" texts translated.: ${inputJson}`,
        },
      ],
      temperature: 0,
    });

    console.log("Received response from Model.");

    const translatedJson = result.data.choices[0].message.content.trim()

    console.log("Parsing JSON.");

    const translatedText = JSON.parse(translatedJson);

    return translatedText;
  }


module.exports = translateText;
