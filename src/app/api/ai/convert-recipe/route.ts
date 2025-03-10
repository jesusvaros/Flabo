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
9. For notes, include any special tips, substitutions, or storage instructions`;

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

    const { messages, ticketId } = await req.json();

    if (!ticketId) {
      throw new Error("Ticket ID is required");
    }

    // Verify the user owns the ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('creator_id')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    if (ticket.creator_id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to convert this recipe" },
        { status: 403 }
      );
    }

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
    
    const conversionData: CreateRecipeConversion = {
      ticket_id: ticketId,
      created_by: user.id,
      title: recipe.recipe.title,
      ingredients: recipe.recipe.ingredients,
      instructions: recipe.recipe.instructions,
      notes: recipe.recipe.notes || [],
    };

    const { error } = await supabase
      .from('recipe_conversions')
      .insert(conversionData);

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error("Failed to save recipe conversion");
    }

    // Get all conversions for this ticket
    const { data: conversions, error: fetchError } = await supabase
      .from('recipe_conversions')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error("Error fetching conversions:", fetchError);
    }

    return NextResponse.json({
      recipe: recipe.recipe,
      conversions: conversions || []
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to convert drawing to recipe" },
      { status: 500 }
    );
  }
}
