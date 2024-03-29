const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser"); // Add this line

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Assuming your index.html is in the "public" directory

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const languageMap = {
  "sv-SE": "Swedish",
  "en-US": "English",
  // Add more language codes and their corresponding names as needed
};

app.use(cors({
  origin: 'https://photivo.se' // Replace with your client's origin URL
}));

app.post("/translate", async (req, res) => {
  try {
    let { originalLanguage, desiredLanguage, word } = req.body;
    console.log("Received request:", { originalLanguage, desiredLanguage, word });
    
    // Map language codes to language names
    originalLanguage = languageMap[originalLanguage] || originalLanguage;
    desiredLanguage = languageMap[desiredLanguage] || desiredLanguage;
    
    const prompt = `Translate the word "${word}" from ${originalLanguage} to ${desiredLanguage}. The word "${word}" in ${originalLanguage} can be used in the following sentence: "${word} sentence in ${originalLanguage}." Provide the translation of the sentence in both ${originalLanguage} and ${desiredLanguage}, separated by a comma.`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const translatedText = response.data.choices[0].text;
    console.log(translatedText);

    res.json({ translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});





//Continue HERE: https://platform.openai.com/examples/default-translate