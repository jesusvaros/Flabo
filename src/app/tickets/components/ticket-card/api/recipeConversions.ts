import { RecipeConversion } from '@/types/recipe-conversions';
import { createClient } from '../../../../../../utils/supabase/client';

interface CreateConversionParams {
  ticketId: string;
  content: string;
  type: 'text' | 'link' | 'image' | 'drawing';
  customPrompt?: string;
}

// Create a new recipe conversion
export const createConversion = async ({
  ticketId,
  content,
  type,
  customPrompt
}: CreateConversionParams): Promise<RecipeConversion | null> => {
  // Client-side AI processing
  const processedRecipe = await processRecipeWithAI(content, customPrompt);
  
  const supabase = createClient();
  // Create entry in Supabase
  const { data, error } = await supabase
    .from('recipe_conversions')
    .insert({
      ticket_id: ticketId,
      content: content,
      processed_content: processedRecipe,
      type: type,
      custom_prompt: customPrompt,
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

// Update an existing conversion
export const updateConversion = async (
  conversionId: string, 
  updates: Partial<RecipeConversion>
): Promise<RecipeConversion | null> => {
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

// Client-side AI processing
// This function processes the recipe text with client-side AI
const processRecipeWithAI = async (content: string, customPrompt?: string): Promise<any> => {
  // Replace with your actual AI processing logic
  // This is a placeholder that simulates AI processing
  try {
    // In a real implementation, you would call your AI service here
    // For now, we'll create a basic structure that mimics the expected format
    
    const defaultPrompt = "Extract the title, ingredients, instructions, and notes from this recipe.";
    const prompt = customPrompt || defaultPrompt;
    
    console.log(`Processing recipe with prompt: ${prompt}`);
    console.log(`Content to process: ${content}`);
    
    // Simple parsing logic - in production, this would be replaced with actual AI processing
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    let title = '';
    const ingredients = [];
    const instructions = [];
    const notes = [];
    
    let currentSection = 'title';
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim();
      
      if (lowerLine.includes('ingredient') || lowerLine === 'ingredients:') {
        currentSection = 'ingredients';
        continue;
      } else if (lowerLine.includes('instruction') || lowerLine.includes('directions') || lowerLine === 'instructions:' || lowerLine === 'steps:') {
        currentSection = 'instructions';
        continue;
      } else if (lowerLine.includes('note') || lowerLine === 'notes:') {
        currentSection = 'notes';
        continue;
      }
      
      if (currentSection === 'title' && !title) {
        title = line.trim();
        currentSection = 'ingredients'; // Assume ingredients come after title
      } else if (currentSection === 'ingredients') {
        ingredients.push(line.trim());
      } else if (currentSection === 'instructions') {
        instructions.push(line.trim());
      } else if (currentSection === 'notes') {
        notes.push(line.trim());
      }
    }
    
    // Format the result to match what's expected by the recipe display
    return {
      title,
      ingredients: ingredients.map(item => ({ text: item })),
      instructions: instructions.map(item => ({ text: item })),
      notes: notes.join('\n')
    };
    
  } catch (error) {
    console.error('Error processing recipe with AI:', error);
    throw new Error('Failed to process recipe with AI');
  }
};
