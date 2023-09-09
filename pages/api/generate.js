import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "API key not configured",
      }
    });
    return;
  }

  const ingredients = req.body.ingredients || '';
  console.log(ingredients);
  if ( ingredients.length < 1 ) {
    res.status(400).json({
      error: {
        message: "Please enter at least one ingredient",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(ingredients),
      temperature: 0.6,
    });
    // Return recipes
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(ingredients) {
  const ingredientsList = ingredients.join(", ").replace(/,(?=[^,]+$)/, ', and');
  return `suggest 3 healthy dinner recipe ideas that calls for ${ingredientsList}.`;
}
