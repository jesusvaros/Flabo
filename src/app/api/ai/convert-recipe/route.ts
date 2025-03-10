import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the expected response structure
const RESPONSE_FORMAT = {
  recipe: {
    title: "string - The recipe title",
    ingredients: ["string[] - Array of ingredients with quantities"],
    instructions: ["string[] - Array of step-by-step instructions"],
    notes: ["string[] - Array of additional notes or tips (optional)"]
  }
};

const SYSTEM_PROMPT = `You are a recipe conversion assistant. Convert drawings into structured recipes.
ALWAYS respond with a JSON object in this exact format:
${JSON.stringify(RESPONSE_FORMAT, null, 2)}

Rules:
1. ALWAYS maintain the exact JSON structure shown above
2. For ingredients, include quantity and unit (e.g., "2 cups flour")
3. For instructions, break down into clear, numbered steps
4. Keep notes concise and relevant
5. If any field is empty, use an empty array []`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }

    // Parse and validate the JSON response
    const recipe = JSON.parse(content);
    
    // Basic validation of the response structure
    if (!recipe.recipe?.title || !Array.isArray(recipe.recipe?.ingredients) || !Array.isArray(recipe.recipe?.instructions)) {
      throw new Error("Invalid response format from AI");
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to convert drawing to recipe" },
      { status: 500 }
    );
  }
}
