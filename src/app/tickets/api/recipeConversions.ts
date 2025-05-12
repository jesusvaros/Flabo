import { RecipeConversion } from '@/types/recipe-conversions';
import { createClient } from '../../../../utils/supabase/client';

interface RecipeSource {
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
  // Client-side AI processing
  const processedRecipe = await processRecipeWithAI(sources);
  
  const supabase = createClient();
  // Create entry in Supabase
  const { data, error } = await supabase
    .from('recipe_conversions')
    .insert({
      ticket_id: ticketId,
      content: JSON.stringify(sources),
      processed_content: processedRecipe,
      created_at: new Date().toISOString(),
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating recipe conversion:', error);
    return null;
  }
  
  return data as RecipeConversion;
};

// Process recipe content with AI (client-side)
// This is a placeholder for the actual AI processing logic
async function processRecipeWithAI(sources: RecipeSource): Promise<string> {
  console.log('Processing recipe with AI using multiple sources:', sources);
  
  const sourceDescription = [
    sources.text ? `Text (${sources.text.substring(0, 30)}...)` : '',
    sources.linkUrl ? `Link (${sources.linkUrl})` : '',
    sources.images ? `Images (${sources.images.length})` : '',
  ].filter(Boolean).join(', ');
  
  // In a real implementation, this would call an API endpoint or client-side AI model
  return `Processed recipe from sources: ${sourceDescription}`;
}

interface UpdateConversionParams {
  conversionId: string;
  updates: Partial<RecipeConversion>;
}

// Update an existing conversion
export const updateConversion = async ({
  conversionId,
  updates,
}: UpdateConversionParams): Promise<RecipeConversion | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('recipe_conversions')
    .update(updates)
    .eq('id', conversionId)
    .select('*')
    .single();
  
  if (error) {
    console.error('Error updating recipe conversion:', error);
    return null;
  }
  
  return data as RecipeConversion;
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
