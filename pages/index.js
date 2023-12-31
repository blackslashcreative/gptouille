import Head from "next/head";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { AiFillMinusCircle } from "react-icons/ai";
import MarkdownView from 'react-showdown';

export default function Home() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [result, setResult] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateRecipes(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredients }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      setLoading(false);
      setIngredientInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      setError(error.message);
    }
  }

  const addIngredient = (e) => {
    e.preventDefault();
    if (ingredientInput) {
      setIngredients([...ingredients, ingredientInput]);
      setIngredientInput("");
    }
  }
  
  const removeIngredient = (item)  => {
    // console.log(`item... ${JSON.stringify(item.ingredient)}`);
    const leftovers = ingredients.filter((ingtemp) => item.ingredient !== ingtemp);
    setIngredients(leftovers);
  }

  const listIngredients = ingredients.map((ingredient) => <button key={ingredient} className="pillbutton" onClick={() => removeIngredient({ingredient})}>{ingredient} <AiFillMinusCircle /></button>);

  return (
    <div>
      <Head>
        <title>gptouille</title>
        <link rel="icon" href="/rat.png" />
      </Head>

      <main className="main">
        <h1>gptouille.ai</h1>
        <p className="subtitle">("jee-pee-too-ee" like ratatouille :)</p>
        <img src="/rat.png" className="icon" />
        <p className="text-center">Hey gptouille, I have these ingredients to use up...<br />What's something healthy I can make?</p>
        <form onSubmit={addIngredient}>
          <input
            type="text"
            name="ingredient"
            placeholder="&quot;ginger&quot;"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
          />
          <input type="submit" value="+" />
        </form>
        {ingredients && (
          <div className="ingredientsList">
            {listIngredients}
          </div>
        )}
        <button className="generateButton" onClick={generateRecipes}>
          {loading ? <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : 'Generate Recipe'}
        </button>
        {result && (
          <div className="result">
            <MarkdownView
              markdown={result}
              options={{ 
                simpleLineBreaks: true,
                requireSpaceBeforeHeadingText: true
              }}
            />
          </div>
        )}
        {error && <div className="status error text-danger">{error}</div>}
      </main>
    </div>
  );
}
