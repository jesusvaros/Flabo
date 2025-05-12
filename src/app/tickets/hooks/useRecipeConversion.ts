import { useState } from 'react';
import { RecipeConversion } from '@/types/recipe-conversions';
import { createConversion } from '../api/recipeConversions';

interface UseRecipeConversionProps {
  ticketId: string;
  existingConversions?: RecipeConversion[];
}

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

export function useRecipeConversion({ ticketId, existingConversions = [] }: UseRecipeConversionProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recipeConversions, setRecipeConversions] = useState<RecipeConversion[]>(existingConversions);
  const [selectedConversion, setSelectedConversion] = useState<RecipeConversion | null>(
    existingConversions.length > 0 ? existingConversions[0] : null
  );

  // Create recipe from multiple sources
  const createRecipeFromSources = async (sources: RecipeSource) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create conversion in database with all sources
      const newConversion = await createConversion({
        ticketId,
        sources,
      });

      // Update local state if conversion was successful
      console.log('newConversion', newConversion);
      if (newConversion) {
        setRecipeConversions(prev => [newConversion, ...prev]);
        setSelectedConversion(newConversion);
      }

      return newConversion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe');
      console.error('Error creating recipe:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Select a conversion
  const selectConversion = (conversion: RecipeConversion) => {
    setSelectedConversion(conversion);
  };

  return {
    isLoading,
    error,
    recipeConversions,
    selectedConversion,
    createRecipeFromSources,
    selectConversion,
  };
}
