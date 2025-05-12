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

    const { ticketId, recipeData } = await req.json();
    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const recipeResponse = await makeChatCompletion<RecipeResponse>({
      systemPrompt: SystemPrompts.CONVERT_RECIPE,
      userMessage: recipeData,
      temperature: 0.3,
      responseFormat: { type: 'json_object' }
    });

    // Create a new recipe conversion record
    console.log(recipeResponse,'esqueree')
    const recipeConversion: CreateRecipeConversion = {
      ticket_id: ticketId,
      created_by: user.id,
      title: recipeResponse.recipe.title,
      ingredients: recipeResponse.recipe.ingredients,
      instructions: recipeResponse.recipe.instructions,
      notes: recipeResponse.recipe.notes || [],
    };

    // Save to Supabase
    const { data: savedRecipe } = await supabase
      .from('recipe_conversions')
      .insert([recipeConversion])
      .select('id, title, ingredients, instructions, notes')
      .single();


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
  }
}
