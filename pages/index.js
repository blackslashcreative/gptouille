import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { AiFillMinusCircle } from "react-icons/ai";

export default function Home() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [result, setResult] = useState();

  async function generateRecipes(event) {
    event.preventDefault();
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
      setIngredientInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const addIngredient = (e) => {
    e.preventDefault();
    setIngredients([...ingredients, ingredientInput]);
    setIngredientInput("");
  }
  
  const removeIngredient = (item)  => {
    // console.log(`item... ${JSON.stringify(item.ingredient)}`);
    const leftovers = ingredients.filter((ingtemp) => item.ingredient !== ingtemp);
    setIngredients(leftovers);
  }

  const listIngredients = ingredients.map((ingredient) => <button key={ingredient} className={styles.pillbutton} onClick={() => removeIngredient({ingredient})}>{ingredient} <AiFillMinusCircle /></button>);

  return (
    <div>
      <Head>
        <title>gptouille</title>
        <link rel="icon" href="/rat.png" />
      </Head>

      <main className={styles.main}>
        <h1>gptouille</h1>
        <p className="subtitle">("gee-pee-too-ee" like ratatouille :)</p>
        <img src="/rat.png" className={styles.icon} />
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
          <div className={styles.ingredientsList}>
            {listIngredients}
          </div>
        )}
        <button className={styles.generateButton} onClick={generateRecipes}>Generate Recipes</button>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
