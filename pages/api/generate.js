import OpenAI from 'openai';

const openai = new OpenAI({
  api_key: process.env.OPENAI_API_KEY
});

export default async function (req, res) {
  if (!openai.apiKey) {
    res.status(500).json({
      error: {
        message: "API key not configured",
      }
    });
    return;
  }

  const ingredients = req.body.ingredients || '';

  if ( ingredients.length < 1 ) {
    res.status(400).json({
      error: {
        message: "Please enter at least one ingredient.",
      }
    });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // gpt-4 ??? (longer latency, more powerful, more expensive)
      messages: [
        { role: 'user', content: generatePrompt(ingredients) },
        { role: 'user', content: 'Format the results in markdown.' }, 
        { role: 'user', content: 'Start your answer with the recipe title as a headin level 1 in markdown.' },
        { role: 'user', content: 'Text only, no images please.' }
      ],
      temperature: 0.6,
      max_tokens: 400 // length of response... 4000 for production
    });
    // Return recipes
    console.log(JSON.stringify(completion.choices[0].message.content));
    res.status(200).json({ result: completion.choices[0].message.content });
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
  return `suggest a healthy dinner recipe idea that calls for ${ingredientsList}.`;
}
