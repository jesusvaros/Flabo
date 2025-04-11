import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { CreateRecipeConversion } from "@/types/recipe-conversions";
import { makeChatCompletion, SystemPrompts } from "../../../../../utils/transformers/openaiClient";

// Define the expected response structure
interface RecipeResponse {
  recipe: {
    title: string;
    ingredients: string[];
    instructions: string[];
    notes: string[];
  }
}

const SYSTEM_PROMPT = `You are a recipe conversion assistant. Convert drawings into structured recipes.
ALWAYS respond with a JSON object in this exact format:
${JSON.stringify({ recipe: { title: "string", ingredients: ["string"], instructions: ["string"], notes: ["string"] } }, null, 2)}

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
      .eq('creator_id', user.id)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Ticket not found or not owned by user" },
        { status: 404 }
      );
    }

    // Get the ticket content
    const { data: ticketData, error: contentError } = await supabase
      .from('tickets')
      .select('content, ticket_images(image_url, caption, extracted_text)')
      .eq('id', ticketId)
      .single();

    if (contentError || !ticketData) {
      return NextResponse.json(
        { error: "Failed to get ticket content" },
        { status: 500 }
      );
    }

    // Prepare the data for the AI
    const content = ticketData.content;
    const images = ticketData.ticket_images || [];

    // Extract text from images (if available)
    const imageTexts = images
      .map(img => img.extracted_text)
      .filter(Boolean)
      .join("\n\n");

    // Prepare the prompt
    const userMessage = customPrompt || `Convert this recipe drawing into a structured recipe:
    
Ticket Content: ${content}

${imageTexts ? `Text extracted from images:\n${imageTexts}` : ''}

Please extract the recipe information and return it in the specified JSON format.`;

    // Call OpenAI with our unified client
    const recipeData = await makeChatCompletion<RecipeResponse>({
      systemPrompt: SYSTEM_PROMPT,
      userMessage,
      temperature: 0.3,
      responseFormat: { type: 'json_object' }
    });

    // Create a new recipe conversion record
    const recipeConversion: CreateRecipeConversion = {
      ticket_id: ticketId,
      created_by: user.id,
      title: recipeData.recipe.title,
      ingredients: recipeData.recipe.ingredients,
      instructions: recipeData.recipe.instructions,
      notes: recipeData.recipe.notes || [],
      custom_prompt: customPrompt || undefined
    };

    // Save to Supabase
    const { data: savedRecipe, error: saveError } = await supabase
      .from('recipe_conversions')
      .insert([recipeConversion])
      .select('id, title, ingredients, instructions, notes')
      .single();

    if (saveError) {
      console.error("Error saving recipe:", saveError);
      return NextResponse.json(
        { error: "Failed to save recipe conversion" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Recipe converted successfully",
      recipe: savedRecipe
    });

  } catch (error) {
    console.error("Error converting recipe:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
