import { RecipeConversion } from '@/types/recipe-conversions';
import { createClient } from '../../../../utils/supabase/client';
import { processRecipeWithAI } from '../../../../utils/transformers/openaiClient';

export interface RecipeSource {
  text?: string;
  linkUrl?: string;
  images?: {
    id?: string;
    ticket_id?: string;
    image_title?: string;
    image_description?: string;
    image_url?: string;
    storage_path?: string;
  }[];
  customPrompt?: string;
  ticketData?: {
    id?: string;
    content?: string;
    text_content?: string;
  };
}

interface CreateConversionParams {
  ticketId: string;
  sources: RecipeSource;
}

// Create a new recipe conversion
export const createConversion = async ({
  ticketId,
  sources,
}: CreateConversionParams): Promise<RecipeConversion | null> => {
  try {
    // Call the AI endpoint for conversion
    const recipeData = processRecipeWithAI(sources);
    const response = await fetch('/api/ai/convert-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId,
        recipeData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to convert recipe');
    }

    return await response.json().then((data) => data.recipe);

  } catch (err) {
    console.error('Error in recipe conversion process:', err);
    return null;
  }
};



// Get all conversions for a ticket
export const getConversions = async (ticketId: string): Promise<RecipeConversion[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('recipe_conversions')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipe conversions:', error);
    throw new Error(`Failed to fetch recipe conversions: ${error.message}`);
  }

  return data as RecipeConversion[];
};
