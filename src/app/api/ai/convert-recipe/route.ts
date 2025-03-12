import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { CreateRecipeConversion } from "@/types/recipe-conversions";

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
5. If any field is empty, use an empty array []
6. For the title, make it descriptive but concise (e.g., "Classic Chocolate Chip Cookies")
7. For ingredients, always include units and be specific (e.g., "1 cup all-purpose flour" not just "flour")
8. For instructions, include cooking times and temperatures when relevant
9. For notes, include any special tips, substitutions, or storage instructions
10. The response has to be always on the same language as the drawing`;

export async function POST(req: Request) {
  try {
    // Get the current user from Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { ticketId, customPrompt } = await req.json();

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Verify the user owns the ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('creator_id, id')
      .eq('id', ticketId)
      .single();

    console.log("Ticket query result:", { ticket, ticketError });

    if (ticketError || !ticket) {
      console.error("Ticket error:", ticketError);
      return NextResponse.json(
        { error: ticketError?.message || "Ticket not found" },
        { status: 404 }
      );
    }

    if (ticket.creator_id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to convert this recipe" },
        { status: 403 }
      );
    }

    // Get the drawing data from ticket_drawings table
    const { data: drawingData, error: drawingError } = await supabase
      .from('ticket_drawings')
      .select('data')
      .eq('ticket_id', ticketId)
      .single();

    console.log("Drawing query result:", { drawingData, drawingError });

    if (drawingError || !drawingData?.data) {
      console.error("Drawing error:", drawingError);
      return NextResponse.json(
        { error: "No drawing data found for this ticket" },
        { status: 400 }
      );
    }

    const basePrompt = `
      I have a drawing of a recipe. Here's the relevant information:
      Drawing Data: ${JSON.stringify(drawingData.data)}

      Please analyze this drawing and extract:
      1. The recipe title from any prominent text or header
      2. List of ingredients with their quantities (look for text near ingredient items)
      3. Cooking steps (follow any arrows or numbered elements)
      4. Any special notes or tips
    `;

    const userPrompt = customPrompt
      ? `${basePrompt}\n\nAdditional Instructions:\n${customPrompt}`
      : basePrompt;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content in response from AI" },
        { status: 500 }
      );
    }

    console.log("OpenAI response content (first 200 chars):", content.substring(0, 200) + "...");

    // Parse and validate the JSON response
    let recipe;
    try {
      recipe = JSON.parse(content);
    } catch (error) {
      console.error("JSON parse error:", error);
      return NextResponse.json(
        { error: "Failed to parse AI response: " + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      );
    }

    // Basic validation of the response structure
    if (!recipe.recipe?.title || !Array.isArray(recipe.recipe?.ingredients) || !Array.isArray(recipe.recipe?.instructions)) {
      console.error("Invalid response format:", recipe);
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      );
    }

    // Store the conversion in the database
    const conversion: CreateRecipeConversion = {
      ticket_id: ticketId,
      created_by: user.id,
      title: recipe.recipe.title,
      ingredients: recipe.recipe.ingredients,
      instructions: recipe.recipe.instructions,
      notes: recipe.recipe.notes || [],
      custom_prompt: customPrompt || undefined,
    };

    const { data: newConversion, error: conversionError } = await supabase
      .from('recipe_conversions')
      .insert(conversion)
      .select()
      .single();

    if (conversionError) {
      console.error("Conversion error:", conversionError);
      return NextResponse.json(
        { error: "Failed to save conversion: " + conversionError.message },
        { status: 500 }
      );
    }

    // Get all conversions for this ticket
    const { data: conversions, error: fetchError } = await supabase
      .from('recipe_conversions')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch conversions: " + fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversions });
  } catch (error) {
    console.error("Error converting recipe:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to convert recipe" },
      { status: 500 }
    );
  }
}
